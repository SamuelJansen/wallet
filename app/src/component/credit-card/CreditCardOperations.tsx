import { useContext, useState } from 'react';
import { AppContext, AppContextProps } from '../../context/AppContext';
import { ICON_SIZE, StyleService } from '../../service/StyleService'
import { INSTALLMENT_STATUS } from "../../service/InvoiceService";
import { DotsThreeOutlineVertical, ShareFat, ShareNetwork, Trash, XCircle, PaperPlaneTilt, Prohibit, DotsThreeOutline } from '@phosphor-icons/react';
import * as Dialog from "@radix-ui/react-dialog";
import { DOMAIN, OPERATION_LIST, ResourceAccessAllRequestApi, CONTACT_LIST } from '../../service/ResourceService';
import { BinaryStateHandler, useBinaryStateHandler } from '../../context-manager/ContextState';
import { StringUtil } from '../../util/StringUtil';
import { CreditCardApi } from '../../service/CreditCardService';
import { componentExecutor } from '../../framework/ComponentExecutor';
import { ObjectUtil } from '../../util/ObjectUtil';
import { Modal } from '../form/Modal';
import { CreditCardManager } from '../../manager/CreditCardManager';


const enum RESOURCE_OPERATION_TYPE {
    REVOKE = 'REVOKE',
    SHARE = 'SHARE',
    TRANSFER = 'TRANSFER',
    NONE = 'NONE'
}

interface RevertCreditCardProps {
    creditCardRequest: CreditCardApi
} 
interface ShareCreditCardProps {
    operation: RESOURCE_OPERATION_TYPE
    creditCardResourceAccessAllRequest: ResourceAccessAllRequestApi
    creditCardRequest: CreditCardApi
}

export const CreditCardOperations = (props: { creditCard: CreditCardApi }) => {
    const { 
        styleService,
        creditCardManager
    } : {
        styleService: StyleService,
        creditCardManager: CreditCardManager,
    } = useContext<AppContextProps>(AppContext)
    const [selectedOperation, setSelectedOperation] = useState<RESOURCE_OPERATION_TYPE>(RESOURCE_OPERATION_TYPE.NONE) 
    const creditCardOptionsBSH: BinaryStateHandler = useBinaryStateHandler(false)
    const shareCreditCardBSH: BinaryStateHandler = useBinaryStateHandler(false)
    const handleRevertCreditCard = componentExecutor({
        requestConstructor: (data: any): RevertCreditCardProps => {
            console.log(props.creditCard)
            return { 
                creditCardRequest: props.creditCard
            }
        },
        validator: (props: RevertCreditCardProps) => {
            const { creditCardRequest} = {...props}
        },
        requestProcessor: (props: RevertCreditCardProps) => {
            const { creditCardRequest} = {...props}
            creditCardManager.revertCreditCard({ creditCardRequest})
        },
        postRequestProcessor: () => {
            creditCardOptionsBSH.switchIt()
        }
    })
    const handleShareCreditCard = componentExecutor({
        requestConstructor: (data: any): ShareCreditCardProps => {
            return { 
                operation: selectedOperation,
                creditCardResourceAccessAllRequest: {
                    key: null,
                    resourceKeyList: props.creditCard.key ? [props.creditCard.key] : [],
                    domain: DOMAIN.PURCHASE,
                    operationList: OPERATION_LIST,
                    accountKey: data.accountKey
                },
                creditCardRequest: props.creditCard
            }
        },
        validator: (props: ShareCreditCardProps) => {
            const { operation, creditCardResourceAccessAllRequest, creditCardRequest } = {...props}
            if ( ObjectUtil.equals(RESOURCE_OPERATION_TYPE.NONE, operation) || StringUtil.isEmpty(operation)) {
                throw new Error('Operation not selected')
            }
            if (StringUtil.isEmpty(creditCardResourceAccessAllRequest.accountKey)) {
                throw new Error('Account not selected')
            }
        },
        requestProcessor: (props: ShareCreditCardProps) => {
            const { operation, creditCardResourceAccessAllRequest, creditCardRequest } = {...props}
            if (ObjectUtil.equals(RESOURCE_OPERATION_TYPE.SHARE, operation)) {
                creditCardManager.shareCreditCard({ creditCardResourceAccessAllRequest, creditCardRequest })
            }
            if (ObjectUtil.equals(RESOURCE_OPERATION_TYPE.REVOKE, operation)) {
                creditCardManager.revokeCreditCard({ creditCardResourceAccessAllRequest, creditCardRequest })
            }
            if (ObjectUtil.equals(RESOURCE_OPERATION_TYPE.TRANSFER, operation)) {
                creditCardManager.transferCreditCard({ creditCardResourceAccessAllRequest, creditCardRequest })
            }
        },
        postRequestProcessor: () => {
            shareCreditCardBSH.switchIt()
            creditCardOptionsBSH.switchIt()
        }
    })
    const renderShareCreditCardForm = () => {
        return (
            <form onSubmit={(event) => handleShareCreditCard(event, { debugIt: false })} className='mt-2 flex flex-col gap-4'>
                <div className='flex flex-col gap-2'>
                    {/* <label htmlFor='share' className='font-semibold'>share with</label> */}
                    <select 
                        id='accountKeyId' 
                        name='accountKey'
                        className='w-full h-full flex space-x-0 bg-zinc-900 py-3 px-4 rounded text-sm placeholder:text-zinc-500 appearance-none'
                        defaultValue=''
                    >
                        <option disabled value='' className='flex space-between text-zinc-500'>
                            contacts
                        </option>
                        {CONTACT_LIST.map((contact) => {
                            return (
                                <option key={contact.key} value={contact.key}>{contact.fullName}</option>
                            )
                        })}
                    </select>
                </div>
                <footer className={styleService.getFooterButtonContent()}>
                    <button 
                        id={'cancel-share-creditCard'}
                        onClick={() => shareCreditCardBSH.switchIt()}
                    >
                        <XCircle
                            size={ICON_SIZE}
                            color={styleService.getCancelButtonColor()}
                        />
                    </button>
                    <button
                        id={'prohibit-creditCard'}
                        type='submit' 
                        onClick={()  => { setSelectedOperation(RESOURCE_OPERATION_TYPE.REVOKE) }}
                        onSubmit={()  => {}}
                    >
                        <Prohibit
                            size={ICON_SIZE}
                            color={styleService.getIrreversableButtonColor()}
                        />
                    </button>
                    <button 
                        id={'confirm-transfer-creditCard'}
                        type='submit' 
                        onClick={()  => { setSelectedOperation(RESOURCE_OPERATION_TYPE.TRANSFER) }}
                        onSubmit={()  => {}}
                    >
                        <PaperPlaneTilt
                            size={ICON_SIZE}
                            color={styleService.getConfirmButtonColor()}
                        />
                    </button>
                    <button 
                        id={'confirm-share-creditCard'}
                        type='submit' 
                        onClick={()  => { setSelectedOperation(RESOURCE_OPERATION_TYPE.SHARE) }}
                        onSubmit={()  => {}}
                    >
                        <ShareFat
                            size={ICON_SIZE}
                            color={styleService.getConfirmButtonColor()}
                        />
                    </button>
                </footer>
            </form>
        )
    }
    const renderCreditCardOptions = () => {
        return (
            <div className={styleService.getFooterButtonContent()}>
                <Dialog.Close 
                    id={'cancel-creditCard-options'}
                    onClick={() => creditCardOptionsBSH.switchIt()}
                >
                    <XCircle
                        size={ICON_SIZE}
                        color={styleService.getCancelButtonColor()}
                    />
                </Dialog.Close>
                <Dialog.Close 
                    id={'revert-creditCard'}
                    onClick={() => handleRevertCreditCard()}
                >
                    <Trash
                        size={ICON_SIZE}
                        color={styleService.getIrreversableButtonColor()}
                    />
                </Dialog.Close>
                <button 
                    id={'access-share-creditCard-form'}
                    onClick={() => shareCreditCardBSH.switchIt()}
                >
                    <ShareNetwork
                        size={ICON_SIZE}
                        color={styleService.getMainButtonColor()}
                    />
                </button>
            </div>
        )
    }
    return (
        <div
            className={`w-full h-4 flex items-center justify-end ${styleService.getTWTextColor()}`}
        >
            <Dialog.Root open={creditCardOptionsBSH.isIt()} onOpenChange={creditCardOptionsBSH.switchIt}>
            {
                creditCardOptionsBSH.isNotIt() ?
                <Dialog.Trigger>{/*className='py-3 px-4 flex items-center gap-3 bg-violet-500 text-white rounded hover:bg-violet-600'>*/}
                    <DotsThreeOutline  
                        id={'access-creditCard-options'}
                        size={18} 
                        color={styleService.getMainButtonColor()}
                        onClick={() => {
                            creditCardOptionsBSH.switchIt()
                        }}
                    /> 
                </Dialog.Trigger> :
                <Modal
                    title={ shareCreditCardBSH.isIt() ? 'creditCard network': 'creditCard' }
                    renderHandler={ () => shareCreditCardBSH.isIt() ? renderShareCreditCardForm() : renderCreditCardOptions() }
                />            }
            </Dialog.Root>
        </div>
    )
}



            