import { ContexState, ManagerState } from "../context-manager/ContextState";
import { StyleService } from "../service/StyleService";
import { CreditCardApi, CreditCardService } from "../service/CreditCardService";
import { DateTimeUtil } from "../util/DateTimeUtil";
import { InvoiceManager } from "./InvoiceManager";
import { ResourceManager } from "./ResourceManager";

export interface CreditCardManagerStateProps extends ManagerState {
    selectedCreditCard: {
        key: string | null,
        dueDay: string | null
    }
}

export interface CreditCardManagerProps {
    styleService: StyleService,
    resourceManager: ResourceManager,
    creditCardService: CreditCardService,
    invoiceManager: InvoiceManager
}


export class CreditCardManager extends ContexState<CreditCardManagerStateProps> implements CreditCardManagerProps {
    
    styleService: StyleService
    resourceManager: ResourceManager
    creditCardService: CreditCardService
    invoiceManager: InvoiceManager
    
    constructor(props: CreditCardManagerProps) {
        super()
        this.styleService = props.styleService
        this.resourceManager = props.resourceManager
        this.creditCardService = props.creditCardService
        this.invoiceManager = props.invoiceManager
        this.state = {
            ...this.state,
            ...{
                selectedCreditCard: {
                    key: null,
                    dueDay: null
                }
            }
        } as CreditCardManagerStateProps
    }

    getSelectedCreditCard = () => {
        return this.state.selectedCreditCard
    }

    setSelectedCreditCard = (creditCard: CreditCardApi) => {
        if (this.getSelectedCreditCard().key && creditCard.key === this.getSelectedCreditCard().key) {
            this.setState({selectedCreditCard: {
                key: null,
                dueDay: null
            }})
        } else {
            this.setState({selectedCreditCard: {
                key: creditCard.key,
                dueDay: creditCard.dueDay
            }})
        }
        this.getCreditCards()
    }

    getCreditCards = () => {
        const creditCardList = this.creditCardService.getCreditCards()
        this.invoiceManager.getInvoices({
            creditCardList: creditCardList,
            date: this.invoiceManager.getDate()
        })
        return creditCardList
    }

    renderCreditCards = () => {
        const creditCardList = this.creditCardService.getCachedCreditCards()
        if (1 === creditCardList.length && !!!this.getSelectedCreditCard().key) {
            this.setSelectedCreditCard(creditCardList[0])
        }
        return creditCardList.map((creditCard: CreditCardApi) => {
            return (
                <div 
                    key={creditCard.key}
                    className={"container"}
                    style={{
                        maxWidth: '800px',
                        margin: '0 auto 20px auto',
                        padding: '20px',
                        backgroundColor: '#111',
                        boxShadow: '0 0 10px rgba(255, 255, 255, 0.1)',
                        borderRadius: '10px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                      }}
                >
                    {this.resourceManager.renderCreditCardOperations(creditCard)}
                    <div className={"card"}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'space-around',
                            width: '350px',
                            height: '240px',
                            backgroundColor: '#333',
                            borderRadius: '10px',
                            boxShadow: '0 0 10px rgba(255, 255, 255, 0.1)',
                            marginBottom: '20px',
                            position: 'relative'
                          }}
                          onClick={() => this.setSelectedCreditCard(creditCard)}
                    >
                        <div className={"card-number"}
                            style={{
                                fontSize: '24px',
                                fontFamily: '"Courier New", monospace',
                                color: '#CCC'
                            }}
                        >{creditCard.label}</div>
                        <div className={"card-number"}
                            style={{
                                fontSize: '24px',
                                fontFamily: '"Courier New", monospace',
                                color: '#CCC'
                            }}
                        >xxxx xxxx xxxx xxxx</div>
                        <div
                            className={"card-number"}
                            style={{
                                fontSize: '14px',
                                fontFamily: '"Courier New", monospace',
                                color: '#CCC'
                            }}
                        >Exp.: {DateTimeUtil.fromRestDateToMonthSlashYear(creditCard.expirationDate)}</div>
                    </div>
                    <div 
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            width: '350px',
                            listStyle: 'none',
                            padding: '0',
                            margin: '0',
                            alignItems: 'center',
                            alignContent: 'center',
                        
                        }}
                    >
                        <div
                            className='text-gray-100'
                            style={{
                                display: 'flex',
                                width: '100%',
                                marginBottom: '10px',
                                fontSize: '18px',
                            }}
                        >
                            <div
                                className={`${creditCard.value > 0 ? '' : this.styleService.getTWTextColor()}`}
                                style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    width: '50%'
                                }}
                            >Balance: R$ {creditCard.value}</div>
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    width: '50%'
                                }}
                            >Limit: R$ {-creditCard.customLimit}</div>
                        </div>
                        
                        {
                            this.invoiceManager.renderInvoiceDetails({
                                creditCard: creditCard,
                                date: this.invoiceManager.getDate()
                            })
                        }
                    </div>
                    {
                        this.getSelectedCreditCard().key === creditCard.key ? (
                            <div
                                style={{
                                    width: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center'
                                }}
                            >
                                <h2
                                    style={{
                                        marginTop: '20px',
                                        marginBottom: '10px',
                                        fontSize: '18px',
                                        color: '#666'
                                    }}
                                >Installments:</h2>
                                <div className={"transactions"}
                                    style={{
                                        width: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        marginBottom: '20px'
                                    }}
                                >
                                    {
                                        this.invoiceManager.renderInvoices({
                                            creditCard: creditCard,
                                            date: this.invoiceManager.getDate()
                                        })
                                    }
                                </div>
                            </div>
                        ) : <></>
                    }
                </div>
            )
        })
    }
}


export const CreditCardManagerProvider = (props: CreditCardManagerProps) => new CreditCardManager(props)