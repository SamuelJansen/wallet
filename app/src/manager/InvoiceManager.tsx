import { ContexState, ManagerState } from "../context-manager/ContextState";
import { StyleService } from "../service/StyleService";
import { InstallmentApi, InvoiceApi, InvoiceQueryApi, InvoiceService, PurchaseApi } from "../service/InvoiceService";
import { DateTimeUtil } from "../util/DateTimeUtil";
import { CreditCardApi } from "../service/CreditCardService";
import { ResourceManager } from "./ResourceManager";
import { PageService } from "../service/PageService";
import { ObjectUtil } from "../util/ObjectUtil";

export interface InvoiceManagerStateProps extends ManagerState {
    date: Date
    selectedPurchaseKeys: string[]
}

export interface InvoiceManagerProps {
    styleService: StyleService
    pageService: PageService
    invoiceService: InvoiceService
    resourceManager: ResourceManager
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
        creditCardKeyList: props.creditCardList.map((creditCard: CreditCardApi) => creditCard.key).filter(key => !!key),
        date: DateTimeUtil.toRestDate(props.date)
    } 
}


export class InvoiceManager extends ContexState<InvoiceManagerStateProps> implements InvoiceManagerProps {
    
    styleService: StyleService
    pageService: PageService
    invoiceService: InvoiceService
    resourceManager: ResourceManager
    
    constructor(props: InvoiceManagerProps) {
        super()
        this.styleService = props.styleService
        this.pageService = props.pageService
        this.invoiceService = props.invoiceService
        this.resourceManager = props.resourceManager
        this.state = {
            ...this.state,
            ...{
                date: new Date(),
                selectedPurchaseKeys: []
            }
        } as InvoiceManagerStateProps
    }

    pushSelectedPurchasesKey = (key: string) => {
        const selectedPurchaseKeys = this.getSelectedPurchaseKeys()
        const keyIndex = selectedPurchaseKeys.indexOf(key)
        selectedPurchaseKeys.push(key)
        this.setState({selectedPurchaseKeys: selectedPurchaseKeys})
    }

    popSelectedPurchasesKey = (key: string) => {
        const selectedPurchaseKeys = this.getSelectedPurchaseKeys()
        const keyIndex = selectedPurchaseKeys.indexOf(key)
        selectedPurchaseKeys.splice(keyIndex, 1)
        this.setState({selectedPurchaseKeys: selectedPurchaseKeys})
    }

    getSelectedPurchaseKeys = () => {
        return [
            ...this.getState().selectedPurchaseKeys
        ]
    }

    isSelectedPurchaseKey = (key: string) => {
        return 0 <= this.getSelectedPurchaseKeys().indexOf(key)
    }

    updateSelectedPurchaseKeys = (key: string) => {
        if (this.isSelectedPurchaseKey(key)) {
            this.popSelectedPurchasesKey(key)
        } else {
            this.pushSelectedPurchasesKey(key)
        }
    }

    getDate = () => {
        return this.getState().date
    }

    setDate = (givenInvoiceDate: Date) => {
        this.setState({date: givenInvoiceDate})
    }

    getInvoices = (props: InvoiceQueryApiProps) => {
        return this.invoiceService.getInvoices(getInvoiceQueryApi(props))
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
                >Invoice: R$ { invoiceIsPresent ? -invoice.value : '...'}</div>
            </>
        ) 
    }

    renderInvoices = (props: InvoiceRenderProps) => {
        const groupedInstallments: InstallmentAtGroupedInstallmentsApi = this.invoiceService.getInvoicesState()
            .filter((invoice: InvoiceApi) => props.creditCard.key === invoice.creditCard.key)
            .flatMap((invoice: InvoiceApi) => {
                return invoice.installmentList
            })
            .reduce((acc, installment) => {
                (acc[installment.installmentAt] = acc[installment.installmentAt] || []).push(installment);
                return acc;
            }, {} as InstallmentAtGroupedInstallmentsApi)
        
        return ObjectUtil.iterateOver(groupedInstallments).map((key: string, index: number) => {
            return <div
                key={key}
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
                >{DateTimeUtil.toUserDate(key)}</div>
                {
                    groupedInstallments[key].map((installment: InstallmentApi) => {
                        const textCollor = 0 < installment.value ? this.styleService.getTWTextColor() : 'text-gray-100'
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
                                    className={`${textCollor}`}
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
                                        {installment.order + 1 === installment.purchase.installments ? `` : `${installment.order + 1}/${installment.purchase.installments}`}
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
                                {
                                    this.getSelectedPurchaseKeys()[this.getSelectedPurchaseKeys().indexOf(installment.purchaseKey)] ? 
                                    <div
                                        className={`${textCollor}`}
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
                                                {installment.purchase.label}
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
                                                Bought at: {DateTimeUtil.toUserDate(installment.purchase.purchaseAt)}
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
                                                Instalments: {installment.purchase.installments}
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
                                            >R$ {installment.purchase.value}</div>
                                            <div>
                                                {
                                                    this.resourceManager.renderInvoiceOperations(installment, () => {
                                                        this.pageService.getManager()?.reRenderSelectedPage()
                                                    })
                                                }
                                            </div>
                                        </div>

                                    </div> : <></>
                                }


                            </div>                            
                        )
                    })
                } 
            </div>
        })
    
            
    }
}


export const InvoiceManagerProvider = (props: InvoiceManagerProps) => new InvoiceManager(props)