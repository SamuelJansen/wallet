import { ContexState, State } from "../context-manager/ContextState";
import { StyleService } from "../service/StyleService";
import { ResourceAccessAllRequestApi, ResourceService } from "../service/ResourceService";
import { DotsThreeOutline, DotsThreeOutlineVertical } from '@phosphor-icons/react'
import { ObjectUtil } from "../util/ObjectUtil";
import { CreditCardApi } from "../service/CreditCardService";
import { InvoiceService } from "../service/InvoiceService";

export interface ResourceManagerStateProps extends State {
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
}


export const ResourceManagerProvider = (props: ResourceManagerProps) => new ResourceManager(props)