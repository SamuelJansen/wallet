import { useContext, useState } from 'react';
import { AppContext, AppContextProps } from '../../context/AppContext';
import { ICON_SIZE, StyleService } from '../../service/StyleService'
import { InstallmentApi, INSTALLMENT_STATUS } from "../../service/InvoiceService";
import { DotsThreeOutlineVertical, ShareFat, ShareNetwork, Trash, XCircle, PaperPlaneTilt, Prohibit } from '@phosphor-icons/react';
import * as Dialog from "@radix-ui/react-dialog";
import { DOMAIN, OPERATION_LIST, ResourceAccessAllRequestApi, CONTACT_LIST } from '../../service/ResourceService';
import { BinaryStateHandler, useBinaryStateHandler } from '../../context-manager/ContextState';
import { StringUtil } from '../../util/StringUtil';
import { InvoiceManager } from '../../manager/InvoiceManager';
import { PurchaseRequestApi } from '../../service/PurchaseService';
import { CreditCardApi } from '../../service/CreditCardService';
import { componentExecutor } from '../../framework/ComponentExecutor';
import { ObjectUtil } from '../../util/ObjectUtil';
import { Modal } from '../form/Modal';


const enum RESOURCE_OPERATION_TYPE {
    REVOKE = 'REVOKE',
    SHARE = 'SHARE',
    TRANSFER = 'TRANSFER',
    NONE = 'NONE'
}

interface RevertPurchaseProps {
    purchaseRequest: PurchaseRequestApi
    creditCardRequest: CreditCardApi
} 
interface SharePurchaseProps {
    operation: RESOURCE_OPERATION_TYPE
    purchaseResourceAccessAllRequest: ResourceAccessAllRequestApi
    creditCardRequest: CreditCardApi
}

export const PurchaseOperations = (props: { installment: InstallmentApi, creditCard: CreditCardApi }) => {
    const { 
        styleService,
        invoiceManager
    } : {
        styleService: StyleService,
        invoiceManager: InvoiceManager,
    } = useContext<AppContextProps>(AppContext)
    const [selectedOperation, setSelectedOperation] = useState<RESOURCE_OPERATION_TYPE>(RESOURCE_OPERATION_TYPE.NONE) 
    const purchaseOptionsBSH: BinaryStateHandler = useBinaryStateHandler(false)
    const sharePurchaseBSH: BinaryStateHandler = useBinaryStateHandler(false)
    const handleRevertPurchase = componentExecutor({
        requestConstructor: (data: any): RevertPurchaseProps => {
            return { 
                purchaseRequest: {
                    key: props.installment.purchase.key,
                    label: props.installment.purchase.label,
                    value: props.installment.purchase.value,
                    purchaseAt: props.installment.purchase.purchaseAt,
                    installments: props.installment.purchase.installments,
                    creditCardKey: props.installment.purchase.creditCardKey
                } as PurchaseRequestApi,
                creditCardRequest: props.creditCard
            }
        },
        validator: (props: RevertPurchaseProps) => {
            const { purchaseRequest, creditCardRequest } = {...props}
        },
        requestProcessor: (props: RevertPurchaseProps) => {
            const { purchaseRequest, creditCardRequest } = {...props}
            invoiceManager.revertPurchase({ purchaseRequest, creditCardRequest })
        },
        postRequestProcessor: () => {
            purchaseOptionsBSH.switchIt()
        }
    })
    const handleSharePurchase = componentExecutor({
        requestConstructor: (data: any): SharePurchaseProps => {
            return { 
                operation: selectedOperation,
                purchaseResourceAccessAllRequest: {
                    key: null,
                    resourceKeyList: [props.installment.purchaseKey],
                    domain: DOMAIN.PURCHASE,
                    operationList: OPERATION_LIST,
                    accountKey: data.accountKey
                },
                creditCardRequest: props.creditCard
            }
        },
        validator: (props: SharePurchaseProps) => {
            const { operation, purchaseResourceAccessAllRequest, creditCardRequest } = {...props}
            if ( ObjectUtil.equals(RESOURCE_OPERATION_TYPE.NONE, operation) || StringUtil.isEmpty(operation)) {
                throw new Error('Operation not selected')
            }
            if (StringUtil.isEmpty(purchaseResourceAccessAllRequest.accountKey)) {
                throw new Error('Account not selected')
            }
        },
        requestProcessor: (props: SharePurchaseProps) => {
            const { operation, purchaseResourceAccessAllRequest, creditCardRequest } = {...props}
            if (ObjectUtil.equals(RESOURCE_OPERATION_TYPE.SHARE, operation)) {
                invoiceManager.sharePurchase({ purchaseResourceAccessAllRequest, creditCardRequest })
            }
            if (ObjectUtil.equals(RESOURCE_OPERATION_TYPE.REVOKE, operation)) {
                invoiceManager.revokePurchase({ purchaseResourceAccessAllRequest, creditCardRequest })
            }
            if (ObjectUtil.equals(RESOURCE_OPERATION_TYPE.TRANSFER, operation)) {
                invoiceManager.transferPurchase({ purchaseResourceAccessAllRequest, creditCardRequest })
            }
        },
        postRequestProcessor: () => {
            sharePurchaseBSH.switchIt()
            purchaseOptionsBSH.switchIt()
        }
    })
    const renderSharePurchaseForm = () => {
        return (
            <form onSubmit={(event) => handleSharePurchase(event, { debugIt: false })} className='mt-2 flex flex-col gap-4'>
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
                        id={'cancel-share-purchase'}
                        onClick={() => sharePurchaseBSH.switchIt()}
                    >
                        <XCircle
                            size={ICON_SIZE}
                            color={styleService.getCancelButtonColor()}
                        />
                    </button>
                    <button
                        id={'prohibit-purchase'}
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
                        id={'confirm-transfer-purchase'}
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
                        id={'confirm-share-purchase'}
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
    const renderPurchaseOptions = () => {
        return (
            <div className={styleService.getFooterButtonContent()}>
                <Dialog.Close 
                    id={'cancel-purchase-options'}
                    onClick={() => purchaseOptionsBSH.switchIt()}
                >
                    <XCircle
                        size={ICON_SIZE}
                        color={styleService.getCancelButtonColor()}
                    />
                </Dialog.Close>
                <Dialog.Close 
                    id={'revert-purchase'}
                    onClick={() => handleRevertPurchase()}
                >
                    <Trash
                        size={ICON_SIZE}
                        color={styleService.getIrreversableButtonColor()}
                    />
                </Dialog.Close>
                <button 
                    id={'access-share-purchase-form'}
                    onClick={() => sharePurchaseBSH.switchIt()}
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
            className={`w-2 h-4 flex items-center justify-end ${INSTALLMENT_STATUS.PROCESSED === props.installment.status ? styleService.getTWTextColor() : INSTALLMENT_STATUS.ERROR === props.installment.status ? 'text-red-600' : 'text-zinc-500'}`}
        >
            <Dialog.Root open={purchaseOptionsBSH.isIt()} onOpenChange={purchaseOptionsBSH.switchIt}>
            {
                purchaseOptionsBSH.isNotIt() ?
                <Dialog.Trigger>{/*className='py-3 px-4 flex items-center gap-3 bg-violet-500 text-white rounded hover:bg-violet-600'>*/}
                    <DotsThreeOutlineVertical  
                        id={'access-purchase-options'}
                        size={18} 
                        color={styleService.getMainButtonColor()}
                        onClick={() => {
                            purchaseOptionsBSH.switchIt()
                        }}
                    /> 
                </Dialog.Trigger> :
                <Modal
                    title={ sharePurchaseBSH.isIt() ? 'purchase network': 'purchase' }
                    renderHandler={ () => sharePurchaseBSH.isIt() ? renderSharePurchaseForm() : renderPurchaseOptions() }
                />            }
            </Dialog.Root>
        </div>
    )
}



            