import { ContexState, State } from "../context-manager/ContextState";
import { StyleService } from "../service/StyleService";
import { InstallmentApi, InvoiceApi, InvoiceQueryApi, InvoiceService } from "../service/InvoiceService";
import { DateTimeUtil } from "../util/DateTimeUtil";
import { CreditCardApi } from "../service/CreditCardService";
import { ResourceManager } from "./ResourceManager";
import { PageService } from "../service/PageService";
import { ObjectUtil } from "../util/ObjectUtil";
import { CreditCardManager } from "./CreditCardManager";
import { PurchaseRequestApi, PurchaseService } from "../service/PurchaseService";
import { PurchaseOperations } from "../component/purchase/PurchaseOperations";
import { ResourceAccessAllRequestApi, ResourceService } from "../service/ResourceService";

export interface InvoiceManagerStateProps extends State {
    date: Date
    creditCardDateCollection: Map<string, Date>
    selectedPurchaseKeys: string[]
}

export interface InvoiceManagerProps {
    styleService: StyleService
    pageService: PageService
    purchaseService: PurchaseService
    invoiceService: InvoiceService
    resourceService: ResourceService
}

export interface InvoiceQueryApiProps {
    creditCardList: CreditCardApi[],
    date: Date
}

export interface InvoiceRenderProps {
    creditCard: CreditCardApi
    date: Date
}

interface InstallmentAtGroupedInstallmentsApi {
    [key: string]: InstallmentApi[]
}

const getInvoiceQueryApi = (props: InvoiceQueryApiProps): InvoiceQueryApi => {
    return {
        creditCardKeyList: props.creditCardList.map((creditCard: CreditCardApi) => creditCard.key).filter(key => ObjectUtil.isNotEmpty(key)),
        date: DateTimeUtil.toRestDate(props.date)
    }
}

export class InvoiceManager extends ContexState<InvoiceManagerStateProps> implements InvoiceManagerProps {

    styleService: StyleService
    pageService: PageService
    purchaseService: PurchaseService
    invoiceService: InvoiceService
    resourceService: ResourceService
    creditCardManager?: CreditCardManager

    constructor(props: InvoiceManagerProps) {
        super()
        this.styleService = props.styleService
        this.pageService = props.pageService
        this.purchaseService = props.purchaseService
        this.invoiceService = props.invoiceService
        this.resourceService = props.resourceService
        this.state = {
            ...this.state,
            ...{
                date: DateTimeUtil.dateNow(),
                creditCardDateCollection: new Map<string, Date>(),
                selectedPurchaseKeys: []
            }
        } as InvoiceManagerStateProps
    }

    setCreditCardManager = (creditCardManager: CreditCardManager) => {
        this.creditCardManager = creditCardManager
    }

    pushSelectedPurchaseKey = (key: string) => {
        const selectedPurchaseKeys = this.getSelectedPurchaseKeys()
        ObjectUtil.pushItIfNotIn(key, selectedPurchaseKeys)
        this.setState({ selectedPurchaseKeys: selectedPurchaseKeys })
    }

    popSelectedPurchaseKey = (key: string) => {
        const selectedPurchaseKeys = this.getSelectedPurchaseKeys()
        ObjectUtil.popIt(key, selectedPurchaseKeys)
        this.setState({ selectedPurchaseKeys: selectedPurchaseKeys })
    }

    getSelectedPurchaseKeys = () => {
        return [
            ...this.getState().selectedPurchaseKeys
        ]
    }

    isSelectedPurchaseKey = (key: string) => {
        return ObjectUtil.inIt(key, this.getSelectedPurchaseKeys())
    }

    updateSelectedPurchaseKeys = (key: string) => {
        if (this.isSelectedPurchaseKey(key)) {
            this.popSelectedPurchaseKey(key)
        } else {
            this.pushSelectedPurchaseKey(key)
        }
    }

    getDate = (props?: { creditCardKey: string | null }): Date => {
        const possibleDate = props?.creditCardKey ? this.getState().creditCardDateCollection.get(props.creditCardKey) : this.getState().date
        return DateTimeUtil.ofDate(possibleDate ? possibleDate : this.getState().date)
    }

    setDate = (invoiceDate: Date, props?: { creditCardKey: string | null }): void => {
        if (props?.creditCardKey) {
            this.getState().creditCardDateCollection.set(props.creditCardKey, DateTimeUtil.ofDate(invoiceDate))
            this.setState({ creditCardDateCollection: this.getState().creditCardDateCollection })
        }
        else {
            this.setState({ date: DateTimeUtil.ofDate(invoiceDate) })
        }
    }

    getInvoices = (props: InvoiceQueryApiProps): InvoiceApi[] => {
        return this.invoiceService.getInvoices(getInvoiceQueryApi(props))
    }

    newPurchase = (props: { purchaseRequest: PurchaseRequestApi, creditCardRequest: CreditCardApi }) => {
        const {
            purchaseRequest,
            creditCardRequest
        } = {...props}
        return this.purchaseService.newPurchaseCollection([purchaseRequest], { callback: () => this.renewInvoices({ creditCardRequest }) })
    }

    revertPurchase = (props: { purchaseRequest: PurchaseRequestApi, creditCardRequest: CreditCardApi }) => {
        const {
            purchaseRequest,
            creditCardRequest
        } = {...props}
        this.purchaseService.revertPurchaseCollection([purchaseRequest], { callback: () => this.renewInvoices({ creditCardRequest }) })
    }

    sharePurchase = ( props: { purchaseResourceAccessAllRequest: ResourceAccessAllRequestApi, creditCardRequest: CreditCardApi } ) => {
        const {
            purchaseResourceAccessAllRequest,
            creditCardRequest
        } = {...props}
        this.resourceService.sharePurchaseCollection([purchaseResourceAccessAllRequest], { callback: () => this.renewInvoices({ creditCardRequest }) })
    }

    revokePurchase = ( props: { purchaseResourceAccessAllRequest: ResourceAccessAllRequestApi, creditCardRequest: CreditCardApi } ) => {
        const {
            purchaseResourceAccessAllRequest,
            creditCardRequest
        } = {...props}
        this.resourceService.revokePurchaseCollection([purchaseResourceAccessAllRequest], { callback: () => this.renewInvoices({ creditCardRequest }) })
    }

    transferPurchase = ( props: { purchaseResourceAccessAllRequest: ResourceAccessAllRequestApi, creditCardRequest: CreditCardApi } ) => {
        const {
            purchaseResourceAccessAllRequest,
            creditCardRequest
        } = {...props}
        this.resourceService.transferPurchaseCollection([purchaseResourceAccessAllRequest], { callback: () => this.renewInvoices({ creditCardRequest }) })
    }

    renewInvoices = (props: { creditCardRequest: CreditCardApi }): void => {
        this.invoiceService.resetState({creditCardKeyList: [props.creditCardRequest.key]})
        if (props.creditCardRequest.key) {
            this.getInvoices({
                creditCardList: [props.creditCardRequest],
                date: this.getDate({ creditCardKey: props.creditCardRequest.key })
            })
            this.creditCardManager?.getCreditCards({ keyList: [props.creditCardRequest.key], date: this.getDate({ creditCardKey: props.creditCardRequest.key }) })
        }
    }

    renderInvoices = (props: InvoiceRenderProps) => {
        const groupedInstallments: InstallmentAtGroupedInstallmentsApi = this.invoiceService.getInvoicesState()
            .filter((invoice: InvoiceApi) => props.creditCard.key === invoice.creditCard.key)
            .flatMap((invoice: InvoiceApi) => {
                return invoice.installmentList
            })
            .reduce((acc, installment) => {
                (acc[DateTimeUtil.toRestDate(installment.installmentAt)] = acc[DateTimeUtil.toRestDate(installment.installmentAt)] || []).push(installment);
                return acc;
            }, {} as InstallmentAtGroupedInstallmentsApi)
        // https://reactcommunity.org/react-transition-group/css-transition
        // import { CSSTransition } from 'react-transition-group';
        // CSSTransition
        return ObjectUtil.iterateOver(groupedInstallments).map((normalizedInstallmentAt: string, index: number) => {
            return <div
                key={normalizedInstallmentAt}
                style={{
                    width: '100%',
                    fontSize: '14px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'left'
                }}
            >
                <div
                    className='text-gray-500 mx-2'
                    style={{
                        fontSize: '10px'
                    }}
                >
                    {DateTimeUtil.toUserDate(normalizedInstallmentAt)}
                </div>
                {
                    groupedInstallments[normalizedInstallmentAt].map((installment: InstallmentApi) => {
                        const valueColor = 0 < installment.value ? this.styleService.getTWTextColor() : 'text-gray-100'
                        return (
                            <div
                                key={`${installment.key}`}
                                style={{
                                    width: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <div
                                    className={`${valueColor}`}
                                    style={{
                                        width: '100%',
                                        padding: '10px',
                                        margin: '0 0 10px 0',
                                        backgroundColor: '#222',
                                        borderRadius: '5px',
                                        boxShadow: '0 0 5px rgba(255, 255, 255, 0.1)',
                                        textAlign: 'center',
                                        fontSize: '14px',
                                        display: 'flex',
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                    onClick={() => {
                                        this.updateSelectedPurchaseKeys(installment.purchaseKey)
                                    }}
                                >
                                    <div
                                        style={{
                                            display: 'flex',
                                            width: '100%',
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            justifyContent: 'left'

                                        }}
                                    >
                                        <div>
                                            {installment.label}
                                        </div>
                                        <div
                                            style={{
                                                padding: '0 4px 0 4px'
                                            }}
                                        ></div>
                                    </div>
                                    <div
                                        className='text-gray-500'
                                        style={{
                                            margin: '4px 0 0 0',
                                            fontSize: '10px',
                                        }}
                                    >
                                        {1 === installment.purchase.installments ? `` : `${installment.order + 1}/${installment.purchase.installments}`}
                                    </div>
                                    <div
                                        style={{
                                            width: '100px',
                                            display: 'flex',
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                    >
                                        <div>R$ {installment.value}</div>
                                    </div>
                                </div>
                                {this.renderInstallments({ valueColor, installment, creditCard: props.creditCard})}
                            </div>
                        )
                    })
                }
            </div>
        })
    }

    renderInvoiceDetails = (props: InvoiceRenderProps) => {
        const invoice = this.invoiceService.getInvoicesState().find((invoice: InvoiceApi) => {
            return props.creditCard.key === invoice.creditCard.key
        })
        const invoiceIsPresent = !!invoice
        return (
            <>
                <div
                    className='text-gray-100'
                    style={{
                        display: 'flex',
                        width: '100%',
                        marginBottom: '10px',
                        fontSize: '14px',
                    }}
                >
                    <div
                        // className={`${this.styleService.getTWTextColor()}`}
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            width: '50%'
                        }}
                    >Close at: {invoiceIsPresent ? DateTimeUtil.toUserDate(invoice.closeAt) : '...'}</div>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            width: '50%'
                        }}
                    >Due at: {invoiceIsPresent ? DateTimeUtil.toUserDate(invoice.dueAt) : '...'}</div>
                </div>
                <div
                    className={`${invoiceIsPresent && invoice.value < props.creditCard.customLimit ? 'text-red-600' : this.styleService.getTWTextColor()}`}
                    style={{
                        marginBottom: '10px',
                        fontSize: '20px'
                    }}
                >Invoice: R$ {invoiceIsPresent ? -invoice.value : '...'}</div>
            </>
        )
    }

    renderInstallments = (props: { valueColor: string, installment: InstallmentApi, creditCard: CreditCardApi }) => {
        return (
            ObjectUtil.containsIt(props.installment.purchaseKey, this.getSelectedPurchaseKeys()) ?
                <div
                    className={`${props.valueColor}`}
                    style={{
                        width: '100%',
                        padding: '0 10px 10px 10px',
                        margin: '0 0 10px 0',
                        textAlign: 'center',
                        fontSize: '14px',
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            width: '100%',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'left'

                        }}
                    >
                        <div>
                            {props.installment.purchase.label}
                        </div>
                        <div
                            style={{
                                padding: '0 4px 0 4px'
                            }}
                        ></div>
                    </div>
                    <div
                        style={{
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <div
                            className='text-gray-500'
                            style={{
                                display: 'flex',
                                width: '100%',
                                fontSize: '10px',
                                alignItems: 'center',
                                justifyContent: 'right'
                            }}
                        >
                            Bought at: {DateTimeUtil.toUserDateTime(props.installment.purchase.purchaseAt)}
                        </div>
                        <div
                            className='text-gray-500'
                            style={{
                                display: 'flex',
                                width: '100%',
                                fontSize: '10px',
                                alignItems: 'center',
                                justifyContent: 'right'
                            }}
                        >
                            Instalments: {props.installment.purchase.installments}
                        </div>
                    </div>
                    <div
                        style={{
                            width: '100px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <div
                            style={{
                                width: '90px'
                            }}
                        >R$ {props.installment.purchase.value}</div>
                        <PurchaseOperations
                            installment={props.installment}
                            creditCard={props.creditCard}
                        />
                    </div>

                </div> : <></>
        )
    }
}


export const InvoiceManagerProvider = (props: InvoiceManagerProps) => new InvoiceManager(props)