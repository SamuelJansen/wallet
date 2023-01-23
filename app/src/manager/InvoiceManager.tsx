import { ContexState, ManagerState } from "../context-manager/ContextState";
import { StyleService } from "../service/StyleService";
import { InstallmentApi, InvoiceApi, InvoiceQueryApi, InvoiceService } from "../service/InvoiceService";
import { DateTimeUtil } from "../util/DateTimeUtil";
import { CreditCardApi } from "../service/CreditCardService";
import { ResourceManager } from "./ResourceManager";
import { PageService } from "../service/PageService";
import { ObjectUtil } from "../util/ObjectUtil";

export interface InvoiceManagerStateProps extends ManagerState {
    date: Date
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
                date: new Date()
            }
        } as InvoiceManagerStateProps
    }

    getDate = () => {
        return this.state.date
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
                    >Close at: {!!invoice ? DateTimeUtil.toUserDate(invoice.closeAt) : '...'}</div>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            width: '50%'
                        }}
                    >Due at: {!!invoice ? DateTimeUtil.toUserDate(invoice.dueAt) : '...'}</div>
                </div>
                <div
                    className='text-gray-100'
                    style={{
                        marginBottom: '10px',
                        fontSize: '20px'
                    }}
                >Invoice: R$ { !!invoice ? -invoice.value : '...'}</div>
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
                >{DateTimeUtil.toUserDate(key)}</div>
                {
                    groupedInstallments[key].map((installment: InstallmentApi) => {
                        const textCollor = 0 < installment.value ? this.styleService.getTWTextColor() : 'text-gray-100'
                        return (
                            <div 
                                key={installment.key}
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
                            >
                                {/* <div
                                    style={{
                                        width: '90px'
                                    }}
                                >{DateTimeUtil.toUserDate(installment.installmentAt)}</div> */}
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
                                    {installment.order + 1}/{installment.purchase.installments}
                                </div> 
                                <div
                                    style={{
                                        width: '90px',
                                        display: 'flex',
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    <div
                                        style={{
                                            width: '190px'
                                        }}
                                    >R$ {installment.value}</div>
                                    <div>
                                        {
                                            this.resourceManager.renderInvoiceOperations(installment, () => {
                                                this.pageService.getManager()?.reRenderSelectedPage()
                                            })
                                        }
                                    </div>
                                </div>
                            </div>
                        )
                    })
                } 
            </div>
        })
    
            
    }
}


export const InvoiceManagerProvider = (props: InvoiceManagerProps) => new InvoiceManager(props)