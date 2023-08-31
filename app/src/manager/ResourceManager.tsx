import { ContexState, ManagerState } from "../context-manager/ContextState";
import { StyleService } from "../service/StyleService";
import { ResourceAccessAllRequestApi, ResourceService } from "../service/ResourceService";
import { DotsThreeOutlineVertical } from 'phosphor-react'
import { ObjectUtil } from "../util/ObjectUtil";
import { CreditCardApi } from "../service/CreditCardService";
import { InvoiceService } from "../service/InvoiceService";

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
            ...this.state,
            ...{
            }
        } as ResourceManagerStateProps
    }

    getResources = () => {
        // return this.resourceService.getResources()
        return []
    }

    handleShareAll = (event: any) => {

    }

    sharePurchaseCollection = (purchaseColllection: ResourceAccessAllRequestApi[]) => {
        this.resourceService.sharePurchaseCollection(purchaseColllection)
    }

    renderCreditCardOperations = (creditCard: CreditCardApi) => {
        return (
            <div
                className={`w-full h-4 flex items-center justify-end ${this.styleService.getTWTextColor()}`}
            >
                <DotsThreeOutlineVertical 
                    id={'access-credit-card-options'}
                    size={18} 
                    onClick={() => this.resourceService.shareCreditCardCollection([])}
                />
            </div>
        )
    }
}


export const ResourceManagerProvider = (props: ResourceManagerProps) => new ResourceManager(props)