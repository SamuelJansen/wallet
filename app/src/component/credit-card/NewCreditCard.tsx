import { useContext } from 'react';
import { AppContext, AppContextProps } from '../../context/AppContext';
import { ICON_SIZE, StyleService } from '../../service/StyleService'
import { DateTimeUtil } from '../../util/DateTimeUtil';
import { Input } from '../form/Input';
import { PlusCircle, XCircle, PaperPlaneRight } from '@phosphor-icons/react';
import * as Dialog from "@radix-ui/react-dialog";
import { BinaryStateHandler, useBinaryStateHandler } from '../../context-manager/ContextState';
import { CreditCardRequestApi } from '../../service/CreditCardService';
import { CreditCardManager } from '../../manager/CreditCardManager';
import { componentExecutor } from '../../framework/ComponentExecutor';
import { Modal } from '../form/Modal';

interface NewCreditCardProps {
    creditCardRequest: CreditCardRequestApi
}

export const NewCreditCard = (props: { }) => {
    const { 
        styleService,
        creditCardManager
    } : {
        styleService: StyleService,
        creditCardManager: CreditCardManager
    } = useContext<AppContextProps>(AppContext)
    const newCreditCardBSH: BinaryStateHandler = useBinaryStateHandler(false)
    const handleCreateCreditCard = componentExecutor({
        requestConstructor: (data: any): NewCreditCardProps => {
            return { 
                creditCardRequest: {
                    key: null,
                    creditKey: null,
                    cardNumber: data.cardNumber,
                    label: data.label,
                    dueDay: Number(data.dueDay),
                    closingDay: Number(data.closingDay),
                    expirationDate: DateTimeUtil.toRestDate(data.expirationDate),
                    provider: String(data.provider),
                    limit: -1 * Number(data.limit),
                    customLimit: -1 * Number(data.customLimit)
                }
            }
        },
        validator: (props: { creditCardRequest: NewCreditCardProps }) => {
            const { creditCardRequest } = {...props}
        },
        requestProcessor: (props: NewCreditCardProps) => {
            console.log(props)
            const { creditCardRequest } = {...props}
            creditCardManager.createCreditCard({ creditCardRequest })
        },
        postRequestProcessor: () => {
            newCreditCardBSH.switchIt()
        }
    })
    const renderNewCredifCardForm = () => {
        return (
            <form onSubmit={(event) => handleCreateCreditCard(event)} className='mt-2 flex flex-col'>
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
                        key='cardNumber' 
                        name='cardNumber'
                        type='text'
                        label='' 
                        placeholder='card number'
                    /> 
                    <Input
                        key='label' 
                        name='label'
                        type='text'
                        label='' 
                        placeholder='card name'
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
                            key='closingDay'
                            name='closingDay'
                            type='number'
                            label='' 
                            placeholder='close at'
                        /> 
                        <Input
                            key='dueDay' 
                            name='dueDay'
                            type='number'
                            label='' 
                            placeholder='due at'
                        /> 
                    </div>
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
                            key='expirationDate'
                            name='expirationDate'
                            type='date'
                            label='' 
                            placeholder='expiration date'
                        /> 
                        <Input
                            key='provider' 
                            name='provider'
                            type='text'
                            label='' 
                            placeholder='card provider'
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
                            key='limit' 
                            name='limit'
                            type='monetary'
                            label='' 
                            placeholder='limit'
                        /> 
                        <Input
                            key='customLimit' 
                            name='customLimit'
                            type='number'
                            label='' 
                            placeholder='custom limit'
                        /> 
                    </div>
                    <footer className={styleService.getFooterButtonContent()}>
                        <Dialog.Close 
                            id={'cancel-credit-card'}
                            onClick={() => newCreditCardBSH.switchIt()}
                        >
                            <XCircle
                                size={ICON_SIZE}
                                color={styleService.getCancelButtonColor()}
                            />
                        </Dialog.Close>
                        <button 
                            id={'confirm-credit-card'}
                            type='submit' 
                            onSubmit={() => {}}
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
                justifyContent: 'center',
                width: '100%',
                marginBottom: '10px',
                fontSize: '14px',
            }}
        >
            <Dialog.Root open={newCreditCardBSH.isIt()} onOpenChange={newCreditCardBSH.switchIt}>
                <div
                    className='text-gray-100'
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        width: '100%',
                        marginBottom: '10px',
                        fontSize: '14px',
                    }}
                >
                    <Dialog.Trigger 
                        id={newCreditCardBSH.isIt() ? 'cancel-credit-card-operations' : 'access-credit-card-operations'}
                        onClick={() => newCreditCardBSH.switchIt()}
                    >{
                        newCreditCardBSH.isIt() ? 
                        <XCircle 
                            size={ICON_SIZE}
                            color={styleService.getCancelButtonColor()}
                        /> : 
                        <PlusCircle 
                            size={ICON_SIZE}
                            color={styleService.getMainButtonColor()}
                        />
                    }</Dialog.Trigger>
                </div>
                {
                    newCreditCardBSH.isIt() ?
                    <Modal
                        title='new credit card'
                        renderHandler={() => renderNewCredifCardForm()}
                    /> : 
                    <></>
                }
                </Dialog.Root> 
        </div>
    )
}