import { ContexState, State } from "../context-manager/ContextState";
import { StyleService } from "../service/StyleService";
import { CreditCardApi, CreditCardRequestApi, CreditCardService } from "../service/CreditCardService";
import { DateTimeUtil } from "../util/DateTimeUtil";
import { InvoiceManager } from "./InvoiceManager";
import { ObjectUtil } from "../util/ObjectUtil";
import { NewPurchase } from "../component/purchase/NewPurchase";
import { NewCreditCard } from "../component/credit-card/NewCreditCard";
import { ResourceAccessAllRequestApi, ResourceService } from "../service/ResourceService";
import { CreditCardOperations } from "../component/credit-card/CreditCardOperations";

export interface CreditCardManagerStateProps extends State {
    accessibleCreditCardKeys: string[]
    openCreditCardKeys: string[]
    selectedCreditCard: {
        key: string | null
    }
}

export interface CreditCardManagerProps {
    styleService: StyleService,
    creditCardService: CreditCardService,
    invoiceManager: InvoiceManager,
    resourceService: ResourceService
}


export class CreditCardManager extends ContexState<CreditCardManagerStateProps> implements CreditCardManagerProps {
    
    styleService: StyleService
    creditCardService: CreditCardService
    invoiceManager: InvoiceManager
    resourceService: ResourceService
    
    constructor(props: CreditCardManagerProps) {
        super()
        this.styleService = props.styleService
        this.creditCardService = props.creditCardService
        this.invoiceManager = props.invoiceManager
        this.resourceService = props.resourceService
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

    getDate = (props?: { creditCardKey: string | null }): Date => {
        return this.invoiceManager.getDate(props)
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
        const creditCardKeyList: Array<string> = [this.getSelectedCreditCard().key].filter(k => ObjectUtil.isNotNull(k)) as Array<string>
        if (ObjectUtil.isNotEmpty(creditCardKeyList)) {
            this.getCreditCards({keyList: creditCardKeyList, date: this.getDate({ creditCardKey: creditCard.key })}) 
        }
    }

    createCreditCard = (props: { creditCardRequest: CreditCardRequestApi }) => {
        this.creditCardService.createCreditCards([props.creditCardRequest], { callback: () => this.renewCreditCards() })
    }

    getCreditCards = (props?: { keyList: string[], date: Date}) => {
        const creditCardKeyList = props ? props.keyList : this.getAccessibleCreditCardKeys()
        const creditCardList = this.creditCardService.getCreditCards({ keyList: creditCardKeyList })
        creditCardList.map((creditCard: CreditCardApi) => {
            this.pushAccessibleCreditCardKey(!!creditCard.key ? creditCard.key : ObjectUtil.generateUniqueKey())
        })
        if (ObjectUtil.isEmpty(props)) {
            this.invoiceManager.getInvoices({
                creditCardList: creditCardList,
                date: props ? props.date : this.getDate()
            })
        } else {
            const creditCard = creditCardList.filter((creditCard) => ObjectUtil.containsIt(creditCard.key, creditCardKeyList))[0]
            this.invoiceManager.getInvoices({
                creditCardList: creditCard ? [creditCard] : [],
                date: props ? props.date : this.getDate({ creditCardKey: creditCard.key })
            })
        }
        return creditCardList
    }

    renewCreditCards = (props?: { keyList: string[] }) => {
        props?.keyList.map(key => {
            this.popAccessibleCreditCardKey(key)
        })
        this.creditCardService.creditCardCollectionExecutor.clearDataCollection()
        this.getCreditCards({ keyList : [], date: this.getDate() })
    }

    revertCreditCard = (props: { creditCardRequest: CreditCardApi }) => {
        const {
            creditCardRequest
        } = {...props}
        this.creditCardService.revertCreditCardCollection([creditCardRequest], { callback: () => this.renewCreditCards({ keyList: creditCardRequest.key ? [creditCardRequest.key] : [] }) })
    }

    shareCreditCard = ( props: { creditCardResourceAccessAllRequest: ResourceAccessAllRequestApi, creditCardRequest: CreditCardApi } ) => {
        const {
            creditCardResourceAccessAllRequest,
            creditCardRequest
        } = {...props}
        this.resourceService.shareCreditCardCollection([creditCardResourceAccessAllRequest], { callback: () => this.renewCreditCards({ keyList: creditCardRequest.key ? [creditCardRequest.key] : [] }) })
    }

    revokeCreditCard = ( props: { creditCardResourceAccessAllRequest: ResourceAccessAllRequestApi, creditCardRequest: CreditCardApi } ) => {
        const {
            creditCardResourceAccessAllRequest,
            creditCardRequest
        } = {...props}
        this.resourceService.revokeCreditCardCollection([creditCardResourceAccessAllRequest], { callback: () => this.renewCreditCards({ keyList: creditCardRequest.key ? [creditCardRequest.key] : [] }) })
    }

    transferCreditCard = ( props: { creditCardResourceAccessAllRequest: ResourceAccessAllRequestApi, creditCardRequest: CreditCardApi } ) => {
        const {
            creditCardResourceAccessAllRequest,
            creditCardRequest
        } = {...props}
        this.resourceService.transferCreditCardCollection([creditCardResourceAccessAllRequest], { callback: () => this.renewCreditCards({ keyList: creditCardRequest.key ? [creditCardRequest.key] : [] }) })
    }

    renderCreditCard = (creditCard: CreditCardApi) => {
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
                <CreditCardOperations
                    creditCard={creditCard}
                />
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
                            date: this.getDate({ creditCardKey: creditCard.key })
                        })
                    }
                    <NewPurchase
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
                                        date: this.getDate({ creditCardKey: creditCard.key })
                                    })
                                }
                            </div>
                        </div>
                    ) : <></>
                }
            </div>
        )
    }

    renderCreditCards = () => {
        const creditCardList = this.creditCardService.getCachedCreditCards()
        if (1 === creditCardList.length && !!!this.getSelectedCreditCard().key) {
            this.setSelectedCreditCard(creditCardList[0])
        }
        return (
            <div
                style={{
                    width: '100%',
                    margin: '0 auto 20px auto',
                    padding: '10px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                }}
            >
                { creditCardList.map((creditCard: CreditCardApi) => this.renderCreditCard(creditCard)) }
                <NewCreditCard/>
            </div>
        ) 
    }
}


export const CreditCardManagerProvider = (props: CreditCardManagerProps) => new CreditCardManager(props)