import { FormEvent, useContext, useState } from 'react';
import { AppContext, AppContextProps } from '../../context/AppContext';
import { ICON_SIZE, StyleService } from '../../service/StyleService'
import { InstallmentApi, INSTALLMENT_STATUS } from "../../service/InvoiceService";
import { DotsThreeOutlineVertical, PaperPlaneRight, ShareNetwork, Trash, XCircle } from 'phosphor-react';
import * as Dialog from "@radix-ui/react-dialog";
import { DOMAIN, OPERATION_LIST, ResourceAccessAllRequestApi, SHARE_WITH_LIST } from '../../service/ResourceService';
import { useBinaryStateHandler } from '../../context-manager/ContextState';
import { StringUtil } from '../../util/StringUtil';
import { ResourceManager } from '../../manager/ResourceManager';
import { InvoiceManager } from '../../manager/InvoiceManager';
import { PurchaseRequestApi } from '../../service/PurchaseService';
import { CreditCardApi } from '../../service/CreditCardService';


export const PurchaseOperations = (props: { installment: InstallmentApi, creditCard: CreditCardApi, callback?: CallableFunction }) => {
    const { 
        styleService,
        invoiceManager,
        resourceManager
    } : {
        styleService: StyleService,
        invoiceManager: InvoiceManager,
        resourceManager: ResourceManager
    } = useContext<AppContextProps>(AppContext)
    const purchaseOptionsBSH = useBinaryStateHandler(false)
    const sharePurchaseBSH = useBinaryStateHandler(false)
    const handleRevertPurchase = () => {
        const purchaseRequest = {
            key: props.installment.purchase.key,
            label: props.installment.purchase.label,
            value: props.installment.purchase.value,
            purchaseAt: props.installment.purchase.purchaseAt,
            installments: props.installment.purchase.installments,
            creditCardKey: props.installment.purchase.creditCardKey
        } as PurchaseRequestApi
        try{
            invoiceManager.revertPurchase({ purchaseRequest, creditCardRequest: props.creditCard })
            purchaseOptionsBSH.switchIt()
            // alert('')
        } catch (err: any) {
            console.log(err)
            alert(`Share error: ${err.message}`)
        }
    }
    const handleSharePurchase = async (event: FormEvent) => {
        event.preventDefault()
        const formData = new FormData(event.target as HTMLFormElement)
        const data = Object.fromEntries(formData)
        const purchaseColllection = [
            {
                resourceKeyList: [new String(props.installment.purchaseKey)],
                domain: DOMAIN.PURCHASE,
                operationList: OPERATION_LIST,
                accountKey: new String(data.accountKey)
            }
        ] as ResourceAccessAllRequestApi[]
        try{
            if (StringUtil.isEmpty(data.accountKey)) {
                throw new Error('Account not selected')
            }
            resourceManager.sharePurchaseCollection(purchaseColllection)
            sharePurchaseBSH.switchIt()
            purchaseOptionsBSH.switchIt()
            // alert('')
        } catch (err: any) {
            console.log(err)
            alert(`Share error: ${err.message}`)
        }
    }
    const renderSharePurchaseForm = () => {
        return (
            <form onSubmit={(event) => handleSharePurchase(event)} className='mt-2 flex flex-col gap-4'>
                <div className='flex flex-col gap-2'>
                    {/* <label htmlFor='share' className='font-semibold'>share with</label> */}
                    <select 
                        id='accountKeyId' 
                        name='accountKey'
                        className='w-full h-full flex space-x-0 bg-zinc-900 py-3 px-4 rounded text-sm placeholder:text-zinc-500 appearance-none'
                        defaultValue=''
                    >
                        <option disabled value='' className='flex space-between text-zinc-500'>
                            share with
                        </option>
                        {SHARE_WITH_LIST.map((shareWith) => {
                            return (
                                <option key={shareWith.key} value={shareWith.key}>{shareWith.fullName}</option>
                            )
                        })}
                    </select>
                </div>
                <footer className='mt4 flex justify-end gap-x-4'>
                    <button 
                        id={'cancel-share-purchase'}
                        // className={styleService.getTWCancelButton()}
                        onClick={() => sharePurchaseBSH.switchIt()}
                    >
                        <XCircle
                            size={ICON_SIZE}
                            color={styleService.getCancelButtonColor()}
                        />
                    </button>
                    <button 
                        id={'confirm-share-purchase'}
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
            </form>
        )
    }
    const renderPurchaseOptions = () => {
        return (
            <div className='mt4 flex justify-end gap-x-4'>
                <Dialog.Close 
                    id={'cancel-purchase-options'}
                    onClick={() => purchaseOptionsBSH.switchIt()}
                    // className={styleService.getTWMainButton()}
                >
                    <XCircle
                        size={ICON_SIZE}
                        color={styleService.getCancelButtonColor()}
                    />
                </Dialog.Close>
                <Dialog.Close 
                    id={'revert-purchase'}
                    onClick={() => handleRevertPurchase()}
                    // className={styleService.getTWMainButton()}
                >
                    <Trash
                        size={ICON_SIZE}
                        color={styleService.getIrreversableButtonColor()}
                    />
                </Dialog.Close>
                <button 
                    id={'access-share-purchase-form'}
                    onClick={() => sharePurchaseBSH.switchIt()}
                    // className={styleService.getTWMainButton()}
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
                            // this.installmentService.proccessAll({keyList: [installment.key]}, callback)
                            // this.rendeStuff()
                            // this.resourceService.sharePurchaseCollection(
                            //     [
                            //         {
                            //             key: null,
                            //             resourceKeyList: !!installment.purchaseKey ? [installment.purchaseKey] : [ObjectUtil.generateUniqueKey()],
                            //             domain: 'Purchase',
                            //             operationList: ['GET', 'PATCH'],
                            //             accountKey: 'samuel.jansenn@gmail.com'
                            //         }
                            //     ], 
                            //     callback
                            // )
                            purchaseOptionsBSH.switchIt()
                        }}
                    /> 
                </Dialog.Trigger> :
                <Dialog.Portal>
                    <Dialog.Overlay className='bg-black/30 inset-0 fixed'/>
                    <Dialog.Content 
                        className={styleService.getTWDialog()}
                    >
                        {/* <Dialog.Title className="text-3xl font-black">
                            Publique um anúncio
                        </Dialog.Title> */}
                        {
                            sharePurchaseBSH.isIt() ? renderSharePurchaseForm() : renderPurchaseOptions() 
                        }
                    </Dialog.Content>
                </Dialog.Portal>
            }
            </Dialog.Root>
        </div>
    )
}



            