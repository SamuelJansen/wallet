import { useContext, useState } from 'react';
import { AppContext, AppContextProps } from '../../context/AppContext';
import { ICON_SIZE, StyleService } from '../../service/StyleService'
import { InvoiceManager } from '../../manager/InvoiceManager';
import { DateTimeUtil } from '../../util/DateTimeUtil';
import { Input } from '../form/Input';
import { PurchaseRequestApi } from '../../service/PurchaseService';
import { PlusCircle, XCircle, ArrowFatLineLeft, ArrowFatLineRight, CurrencyCircleDollar, ShoppingCartSimple } from '@phosphor-icons/react';
import { ObjectUtil } from '../../util/ObjectUtil';
import { StringUtil } from '../../util/StringUtil';
import * as Dialog from "@radix-ui/react-dialog";
import { useBinaryStateHandler } from '../../context-manager/ContextState';
import { CreditCardApi } from '../../service/CreditCardService';
import { componentExecutor } from '../../framework/ComponentExecutor';
import { Modal } from '../form/Modal';


const enum PURCHASE_OPERATION_TYPE {
    PURCHASE = 'purchase', // <ArrowFatLinesUp/>,
    PAYMENT = 'payment', // <ArrowFatLinesDown/>
    NONE = 'none' // <ArrowFatLinesDown/>
}

interface NewPurchaseProps { 
    operation: PURCHASE_OPERATION_TYPE,
    purchaseRequest: PurchaseRequestApi, 
    creditCardRequest: CreditCardApi 
}

export const NewPurchase = (props: { creditCard: CreditCardApi }) => {
    const { 
        styleService,
        invoiceManager
    } : {
        styleService: StyleService,
        invoiceManager: InvoiceManager
    } = useContext<AppContextProps>(AppContext)
    const setDate = (date: Date): void => {
        invoiceManager.setDate(date, { creditCardKey: props.creditCard.key })
    }
    const getDate = (): Date => {
        return invoiceManager.getDate({ creditCardKey: props.creditCard.key })
    }
    const previousMonth = (): Date => {
        setDate(DateTimeUtil.addMonths(getDate(), -1))
        return getDate()
    }
    const nextMonth = (): Date => {
        setDate(DateTimeUtil.addMonths(getDate(), 1))
        return getDate()
    }
    const [selectedOperation, setSelectedOperation] = useState<PURCHASE_OPERATION_TYPE>(PURCHASE_OPERATION_TYPE.PURCHASE)
    const newPurchaseBSH = useBinaryStateHandler(false)
    const handleCreatePurchase = componentExecutor({
        requestConstructor: (data: any): NewPurchaseProps => {
            return {
                operation: selectedOperation,
                purchaseRequest: {
                    key: null,
                    label: StringUtil.concatIt(new String(data.purchaseLabel).split(' '), ' ').toUpperCase(),
                    value: (PURCHASE_OPERATION_TYPE.PAYMENT === selectedOperation ? 1 : -1) * Number(data.purchaseValue),
                    purchaseAt: DateTimeUtil.concatRestDateTime({
                        yearDashMonthDashDay: String(data.purchaseDate), 
                        hourDashMinute: String(data.purchaseTime)
                    }),
                    installments: ObjectUtil.isEmpty(data.purchaseTimes) || ObjectUtil.equals(0, data.purchaseTimes) ? 1 : Number(data.purchaseTimes),
                    creditCardKey: String(props.creditCard.key)
                },
                creditCardRequest: {
                    ...props.creditCard
                }
            }
        }, 
        validator: (props: NewPurchaseProps) => {
            const { operation, purchaseRequest, creditCardRequest } = {...props}
            if (ObjectUtil.equals(PURCHASE_OPERATION_TYPE.NONE, operation) || ObjectUtil.isEmpty(operation)) {
                throw new Error('Operation not selected')
            }
            if (StringUtil.isEmpty(purchaseRequest.label)) {
                throw new Error('Label cannot be empty')
            }
            if (ObjectUtil.isEmpty(purchaseRequest.value) || ObjectUtil.equals(0, purchaseRequest.value)) {
                throw new Error('Value cannot be empty')
            }
            if (ObjectUtil.isEmpty(purchaseRequest.installments) || ObjectUtil.equals(0, purchaseRequest.installments)) {
                throw new Error('Installments cannot be empty')
            }
            if (ObjectUtil.equals(PURCHASE_OPERATION_TYPE.PAYMENT, operation) && ObjectUtil.notEquals(1, purchaseRequest.installments)) {
                throw new Error('Payment need to be one time only')
            }
        }, 
        requestProcessor: (props: NewPurchaseProps) => {
            const { operation, purchaseRequest, creditCardRequest } = {...props}
            console.log(purchaseRequest)
            invoiceManager.newPurchase({ purchaseRequest, creditCardRequest })
        }, 
        postRequestProcessor: () => {
            newPurchaseBSH.switchIt()
        } 
    })
    const renderNewPurchaseForm = () => {
        return (
            <form onSubmit={(event) => handleCreatePurchase(event)} className='mt-2 flex flex-col'>
                <div
                    className='text-gray-100 gap-4'
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        minWidth: '100',
                        minHeight: '100',
                        fontSize: '14px',
                    }}
                >
                    <Input
                        key='purchaseLabel' 
                        name='purchaseLabel'
                        type='text'
                        label='' 
                        width='100'
                        placeholder='Purchase of'
                    /> 
                    <div
                        className='text-gray-100 gap-y-4 gap-x-2'
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            width: '100%',
                            fontSize: '14px',
                        }}
                    >
                        <Input
                            style={{
                                color: '#CCCCCC',
                                colorScheme: 'dark'
                            }}
                            key='purchaseDate'
                            name='purchaseDate'
                            type='date'
                            label='' 
                            placeholder='date'
                        /> 
                        <Input
                            style={{
                                color: '#CCCCCC',
                                colorScheme: 'dark'
                            }}
                            key='purchaseTime' 
                            name='purchaseTime'
                            type='time'
                            label='' 
                            placeholder='time'
                        /> 
                    </div>
                    <div
                        className='text-gray-100 gap-x-2'
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            width: '100%',
                            fontSize: '14px',
                        }}
                    >
                        <Input
                            width='w-[70%]'
                            key='purchaseValue' 
                            name='purchaseValue'
                            type='monetary'
                            label='' 
                            placeholder='value'
                        /> 
                        <Input
                            key='purchaseTimes' 
                            name='purchaseTimes'
                            type='number'
                            label='' 
                            placeholder='times'
                        /> 
                    </div>
                    <footer className={styleService.getFooterButtonContent()}>
                        <Dialog.Close 
                            id={'cancel-purchase'}
                            onClick={() => newPurchaseBSH.switchIt()}
                        >
                            <XCircle
                                size={ICON_SIZE}
                                color={styleService.getCancelButtonColor()}
                            />
                        </Dialog.Close>
                        <button 
                            id={'confirm-payment'}
                            type='submit' 
                            onClick={() => { setSelectedOperation(PURCHASE_OPERATION_TYPE.PAYMENT) }}
                            onSubmit={() => {}}
                        >
                            <CurrencyCircleDollar 
                                size={ICON_SIZE}
                                color={styleService.getConfirmButtonColor()}
                            />
                        </button>
                        <button 
                            id={'confirm-purchase'}
                            type='submit' 
                            onClick={() => { setSelectedOperation(PURCHASE_OPERATION_TYPE.PURCHASE) }}
                            onSubmit={() => {}}
                        >
                            <ShoppingCartSimple  
                                size={ICON_SIZE}
                                color={styleService.getConfirmButtonColor()}
                            />
                        </button>
                    </footer>
                </div>
            </form>
        )
    }
    return (
        <div
            className='text-gray-100'
            style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                width: '100%',
                marginBottom: '10px',
                fontSize: '14px',
            }}
        >
            <Dialog.Root open={newPurchaseBSH.isIt()} onOpenChange={newPurchaseBSH.switchIt}>
                <div
                    className='text-gray-100'
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        width: '100%',
                        marginBottom: '10px',
                        fontSize: '14px',
                    }}
                >
                    <button
                        id={'next-month'}
                        onClick={() => { 
                            previousMonth()
                            invoiceManager.renewInvoices( { creditCardRequest: props.creditCard } )
                        }}
                    >{
                        <ArrowFatLineLeft
                            size={ICON_SIZE}
                            color={styleService.getBasicButtonColor()}
                        />
                    }</button>
                    <Dialog.Trigger 
                        id={newPurchaseBSH.isIt() ? 'cancel-purchase-operations' : 'access-purchase-operations'}
                        onClick={() => newPurchaseBSH.switchIt()}
                    >{
                        newPurchaseBSH.isIt() ? 
                        <XCircle 
                            size={ICON_SIZE}
                            color={styleService.getCancelButtonColor()}
                        /> : 
                        <PlusCircle 
                            size={ICON_SIZE}
                            color={styleService.getMainButtonColor()}
                        />
                    }</Dialog.Trigger>
                    <button
                        id={'previous-month'}
                        onClick={() => { 
                            nextMonth()
                            invoiceManager.renewInvoices({ creditCardRequest: props.creditCard })
                        }}
                    >{
                        <ArrowFatLineRight
                            size={ICON_SIZE}
                            color={styleService.getBasicButtonColor()}
                        />
                    }</button>
                </div>
                {
                    newPurchaseBSH.isIt() ? 
                    <Modal
                        title='new purchase'
                        renderHandler={() => renderNewPurchaseForm()}
                    /> :
                    <></>
                }
                </Dialog.Root> 
        </div>
    )
}

