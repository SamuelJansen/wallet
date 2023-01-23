import { ContexState, ManagerState } from "../context-manager/ContextState";
import { StyleService } from "../service/StyleService";
import { ResourceService } from "../service/ResourceService";
import { Check, Share} from 'phosphor-react'
import { ObjectUtil } from "../util/ObjectUtil";
import { CreditCardApi } from "../service/CreditCardService";
import { InstallmentApi, INSTALLMENT_STATUS, InvoiceService } from "../service/InvoiceService";

export interface ResourceManagerStateProps extends ManagerState {
}

export interface ResourceManagerProps {
    styleService: StyleService,
    resourceService: ResourceService
    installmentService: InvoiceService
}

export class ResourceManager extends ContexState<ResourceManagerStateProps> implements ResourceManagerProps {
    
    styleService: StyleService
    resourceService: ResourceService
    installmentService: InvoiceService
    
    constructor(props: ResourceManagerProps) {
        super()
        this.styleService = props.styleService
        this.resourceService = props.resourceService
        this.installmentService = props.installmentService
        this.state = {
            ...this.state
        } as ResourceManagerStateProps
    }

    getResources = () => {
        // return this.resourceService.getResources()
        return []
    }

    renderCreditCardOperations = (creditCard: CreditCardApi) => {
        return (
            <div
                className={`w-full h-4 flex items-center justify-end ${this.styleService.getTWTextColor()}`}
            >
                <Share 
                    size={18} 
                    onClick={() => this.resourceService.shareCreditCardCollection([
                        {
                            key: null,
                            resourceKey: !!creditCard.key ? creditCard.key : ObjectUtil.generateUniqueKey(),
                            domain: 'CreditCard',
                            operation: 'GET',
                            accountKey: 'rosane.adina.jansen@gmail.com'
                        },
                        {
                            key: null,
                            resourceKey: !!creditCard.key ? creditCard.key : ObjectUtil.generateUniqueKey(),
                            domain: 'CreditCard',
                            operation: 'GET',
                            accountKey: 'walter.jansenn@gmail.com'
                        },
                        {
                            key: null,
                            resourceKey: !!creditCard.key ? creditCard.key : ObjectUtil.generateUniqueKey(),
                            domain: 'CreditCard',
                            operation: 'PATCH',
                            accountKey: 'rosane.adina.jansen@gmail.com'
                        },
                        {
                            key: null,
                            resourceKey: !!creditCard.key ? creditCard.key : ObjectUtil.generateUniqueKey(),
                            domain: 'CreditCard',
                            operation: 'PATCH',
                            accountKey: 'walter.jansenn@gmail.com'
                        }
                    ])}
                />
            </div>
        )
    }

    renderInvoiceOperations = (installment: InstallmentApi, callback?: CallableFunction) => {
        return (
            <div
                className={`w-full h-4 flex items-center justify-end ${INSTALLMENT_STATUS.PROCESSED === installment.status ? this.styleService.getTWTextColor() : INSTALLMENT_STATUS.ERROR === installment.status ? 'text-red-600' : 'text-zinc-500'}`}
            >
                <Check 
                    size={18} 
                    onClick={() => {
                        this.installmentService.proccessAll({keyList: [installment.key]}, callback)
                    }}
                />
            </div>
        )
    }
}


export const ResourceManagerProvider = (props: ResourceManagerProps) => new ResourceManager(props)