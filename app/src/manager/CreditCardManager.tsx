import { ContexState, ManagerState } from "../context-manager/ContextState";
import { StyleService } from "../service/StyleService";
import { CreditCardApi, CreditCardService } from "../service/CreditCardService";
import { DateTimeUtil } from "../util/DateTimeUtil";
import { InvoiceManager } from "./InvoiceManager";
import { ResourceManager } from "./ResourceManager";
import { ObjectUtil } from "../util/ObjectUtil";
import { CreditCardOperations } from "../component/CreditCard/CreditCardOperations";

export interface CreditCardManagerStateProps extends ManagerState {
    accessibleCreditCardKeys: string[]
    openCreditCardKeys: string[]
    selectedCreditCard: {
        key: string | null
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
                accessibleCreditCardKeys: [],
                selectedCreditCard: {
                    key: null
                },
                openCreditCardKeys: []
            }
        } as CreditCardManagerStateProps
    }

    pushAccessibleCreditCardKey = (key: string) => {
        if (ObjectUtil.isEmpty(key)) {
            return
        }
        const accessibleCreditCardKeys = this.getAccessibleCreditCardKeys()
        ObjectUtil.pushItIfNotIn(key, accessibleCreditCardKeys)
        this.setState({accessibleCreditCardKeys: accessibleCreditCardKeys})
    }

    popAccessibleCreditCardKey = (key: string) => {
        const accessibleCreditCardKeys = this.getAccessibleCreditCardKeys()
        ObjectUtil.popItIfInIt(key, accessibleCreditCardKeys)
        this.setState({accessibleCreditCardKeys: accessibleCreditCardKeys})
    }

    getAccessibleCreditCardKeys = () => {
        return [
            ...this.getState().accessibleCreditCardKeys
        ]
    }

    isAccessibleCreditCardKey = (key: string) => {
        return ObjectUtil.inIt(key, this.getAccessibleCreditCardKeys())
    }

    pushOpenCreditCardKey = (key: string | null) => {
        if (ObjectUtil.isEmpty(key)) {
            return
        }
        const openCreditCardKeys = this.getOpenCreditCardKeys()
        ObjectUtil.pushItIfNotIn(key, openCreditCardKeys)
        this.setState({openCreditCardKeys: openCreditCardKeys})
    }

    popOpenCreditCardKey = (key: string) => {
        const openCreditCardKeys = this.getOpenCreditCardKeys()
        ObjectUtil.popItIfInIt(key, openCreditCardKeys)
        this.setState({openCreditCardKeys: openCreditCardKeys})
    }

    getOpenCreditCardKeys = () => {
        return [
            ...this.getState().openCreditCardKeys
        ]
    }

    isOpenCreditCardKey = (key: string) => {
        return ObjectUtil.inIt(key, this.getOpenCreditCardKeys())
    }

    getSelectedCreditCard = () => {
        return this.state.selectedCreditCard
    }

    setSelectedCreditCard = (creditCard: CreditCardApi) => {
        if (this.getSelectedCreditCard().key && creditCard.key === this.getSelectedCreditCard().key) {
            this.setState({selectedCreditCard: {
                key: null
            }})
        } else {
            this.setState({selectedCreditCard: {
                key: creditCard.key
            }})
        }
        // if () {
        //     this.pushOpenCreditCardKey(creditCard.key)
        // } else {
        //     this.pushOpenCreditCardKey(creditCard.key)
        // }
        const creditCardKeyList: Array<string> = [this.getSelectedCreditCard().key].filter(k => ObjectUtil.isNotNull(k)) as Array<string>
        if (ObjectUtil.isNotEmpty(creditCardKeyList)) {
            this.getCreditCards({keyList: creditCardKeyList, date: this.invoiceManager.getDate({ creditCardKey: creditCard.key })}) 
        }
    }

    getCreditCards = (props?: { keyList: string[], date: Date}) => {
        const creditCardKeyList = props ? props.keyList : this.getAccessibleCreditCardKeys()
        const creditCardList = this.creditCardService.getCreditCards({ keyList: creditCardKeyList })
        creditCardList.map((creditCard: CreditCardApi) => {
            this.pushAccessibleCreditCardKey(!!creditCard.key ? creditCard.key : ObjectUtil.generateUniqueKey())
            // this.invoiceManager.getInvoices({
            //     creditCardList: [creditCard],
            //     date: this.invoiceManager.getDate({ creditCardKey: creditCard.key })
            // })
        })
        // const creditCard = creditCardList.filter((creditCard) => ObjectUtil.containsIt(creditCard.key, creditCardKeyList))[0]
        if (ObjectUtil.isEmpty(props)) {
            this.invoiceManager.getInvoices({
                creditCardList: creditCardList,
                date: props ? props.date : this.invoiceManager.getDate()
            })
        } else {
            const creditCard = creditCardList.filter((creditCard) => ObjectUtil.containsIt(creditCard.key, creditCardKeyList))[0]
            this.invoiceManager.getInvoices({
                creditCardList: [creditCard],
                date: props ? props.date : this.invoiceManager.getDate({ creditCardKey: creditCard.key })
            })
        }
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
                                date: this.invoiceManager.getDate({ creditCardKey: creditCard.key })
                            })
                        }
                        <CreditCardOperations
                            creditCard={creditCard}
                        />
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
                                            date: this.invoiceManager.getDate({ creditCardKey: creditCard.key })
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