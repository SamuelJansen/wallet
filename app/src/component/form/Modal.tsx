import * as Dialog from "@radix-ui/react-dialog";


export interface ModalProps {
    title: string
    renderHandler: CallableFunction
} 


export const Modal = (props: ModalProps) => {
    const {
        title,
        renderHandler
    } = {...props}
    return (
        <Dialog.Portal>
            <Dialog.Overlay className='bg-black/30 inset-0 fixed'/>
            <Dialog.Content className={`flex flex-col fixed bg-[#333333] py-6 px-6 gap-y-4 text-center text-white top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg max-w-[480px] w-[90%] shadow-lg shadow-black/25`}>
                <Dialog.Title className="text-2xl font-black">
                    {props.title}
                </Dialog.Title>
                {
                    props.renderHandler()
                }
            </Dialog.Content>
        </Dialog.Portal>
    )
}

