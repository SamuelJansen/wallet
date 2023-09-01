import { FormEvent, useContext, useState } from 'react';
import { AppContext, AppContextProps } from '../../context/AppContext';
import { ICON_SIZE, StyleService } from '../../service/StyleService'
import { InvoiceManager } from '../../manager/InvoiceManager';
import { DateTimeUtil } from '../../util/DateTimeUtil';
import { Input } from '../form/Input';
import { PurchaseRequestApi } from '../../service/PurchaseService';
import { ArrowFatLinesUp, ArrowFatLinesDown, PlusCircle, XCircle, PaperPlaneRight, ArrowFatLineLeft, ArrowFatLineRight, CreditCard } from 'phosphor-react';
import { ObjectUtil } from '../../util/ObjectUtil';
import { StringUtil } from '../../util/StringUtil';
import * as Dialog from "@radix-ui/react-dialog";
import { useBinaryStateHandler } from '../../context-manager/ContextState';
import { CreditCardApi } from '../../service/CreditCardService';


const OPERATION_TYPES = {
    purchase: 'purchase', // <ArrowFatLinesUp/>,
    payment: 'payment' // <ArrowFatLinesDown/>
} as const

export const CreditCardOperations = (props: { creditCard: CreditCardApi }) => {
    const { 
        styleService,
        invoiceManager
    } : {
        styleService: StyleService,
        invoiceManager: InvoiceManager
    } = useContext<AppContextProps>(AppContext)

    const newPurchaseBSH = useBinaryStateHandler(false)
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
    const handleCreatePurchase = async (event: FormEvent) => {
        event.preventDefault()
        const formData = new FormData(event.target as HTMLFormElement)
        const data = Object.fromEntries(formData)
        const purchaseRequest: PurchaseRequestApi = {
            key: null,
            label: StringUtil.concatIt(new String(data.purchaseLabel).split(' '), ' ').toUpperCase(),
            value: (OPERATION_TYPES.payment === data.operation ? 1 : -1) * Number(data.purchaseValue),
            purchaseAt: DateTimeUtil.concatRestDateTime({
                yearDashMOnthDashDay: String(data.purchaseDate), 
                hourDashMinute: String(data.purchaseTime)
            }),
            installments: ObjectUtil.isEmpty(data.purchaseTimes) || ObjectUtil.equals(0, data.purchaseTimes) ? 1 : Number(data.purchaseTimes),
            creditCardKey: String(props.creditCard.key)
        }
        const creditCardRequest = {
            ...props.creditCard
        } as CreditCardApi
        try{
            if (StringUtil.isEmpty(purchaseRequest.label)) {
                throw new Error('Label cannot be empty')
            }
            if (ObjectUtil.isEmpty(purchaseRequest.value) || ObjectUtil.equals(0, purchaseRequest.value)) {
                throw new Error('Value cannot be empty')
            }
            if (ObjectUtil.isEmpty(purchaseRequest.installments) || ObjectUtil.equals(0, purchaseRequest.installments)) {
                throw new Error('Installments cannot be empty')
            }
            invoiceManager.newPurchase({ purchaseRequest, creditCardRequest })
            newPurchaseBSH.switchIt()
            // alert('')
        } catch (err: any) {
            console.log(err)
            alert(`Purchase creation error: ${err.message}`)
        }
    }

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
                        <div className='flex flex-col'>
                            {/* <label htmlFor='operation' className='font-semibold'>Qual o game</label> */}
                            <select 
                                id='operation' 
                                name='operation'
                                className='w-full h-[90%] flex justify-center py-1 px-3 space-x-0 bg-zinc-900 rounded placeholder:text-zinc-500 appearance-none'
                                defaultValue=''
                                style={{
                                    fontSize: '10px'
                                }}
                            >
                                {/* <option disabled value='' className='flex space-between text-zinc-500'>
                                    Selecione o game que deseja jogar
                                </option> */}
                                {ObjectUtil.keys(OPERATION_TYPES).map((operation) => {
                                    return (
                                        <option 
                                            className='flex justify-center'
                                            key={operation} 
                                            value={operation} 
                                            data-content={operation === OPERATION_TYPES.payment ? <ArrowFatLinesUp/> : <ArrowFatLinesDown/>}
                                        >
                                            {operation === OPERATION_TYPES.payment ? 'Pay' : 'Buy'}
                                        </option>
                                    )
                                })}
                            </select>
                        </div>
                    </div>
                    <div
                        className='text-gray-100 gap-x-2'
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            width: '100%',
                            paddingBottom: '10px',
                            fontSize: '14px',
                        }}
                    >
                        <Input
                            // width='max-w-[40%]'
                            key='purchaseValue' 
                            name='purchaseValue'
                            type='monetary'
                            label='' 
                            placeholder='value'
                        /> 
                        <Input
                            // width='max-w-[40%]'
                            key='purchaseTimes' 
                            name='purchaseTimes'
                            type='number'
                            label='' 
                            placeholder='times'
                        /> 
                    </div>
                    <footer className='mt4 flex justify-end gap-x-4'>
                        <Dialog.Close 
                            id={'cancel-purchase'}
                            // className={styleService.getTWCancelButton()}
                            onClick={() => newPurchaseBSH.switchIt()}
                        >
                            <XCircle
                                size={ICON_SIZE}
                                color={styleService.getCancelButtonColor()}
                            />
                        </Dialog.Close>
                        <button 
                            id={'confirm-purchase'}
                            type='submit' 
                            onSubmit={() => {}}
                            // className={styleService.getTWMainButton()}
                        >
                            <PaperPlaneRight
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
                    <Dialog.Portal>
                        <Dialog.Overlay className='bg-black/30 inset-0 fixed'/>
                        <Dialog.Content 
                            className={styleService.getTWDialog()}
                        >
                            {
                                renderNewPurchaseForm()
                            }
                        </Dialog.Content>
                    </Dialog.Portal> :
                    <></>
                }
                </Dialog.Root> 
        </div>
    )
}

