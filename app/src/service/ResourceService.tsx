import { ContexState, ServiceState } from "../context-manager/ContextState";
import { EnvironmentUtil } from '../util/environment/EnvironmentUtil'
import { ENVIRONEMNT_KEYS } from '../util/environment/EnvironmentKeys'
import { AuthenticationService } from "./AuthenticationService";
import { CollectionStateProps, ContexServiceState, DataCollectionExecutor } from "../framework/DataCollectionExecutor";
import { DataApi } from "../framework/DataApi";


const HTTPS_SCHEMA = `https`
const SCHEMA = EnvironmentUtil.isLocal() || EnvironmentUtil.isLocalToDevelopment() ? `http` : HTTPS_SCHEMA
const BASE_HOST = EnvironmentUtil.isLocal() || EnvironmentUtil.isLocalToDevelopment() ? `localhost` : EnvironmentUtil.get(ENVIRONEMNT_KEYS.BASE_HOST)
const API_HOST = EnvironmentUtil.isDevelopment() || EnvironmentUtil.isLocalToDevelopment() ? EnvironmentUtil.get(ENVIRONEMNT_KEYS.INVESTMENT_API_HOST) : `${BASE_HOST}:7897` 
const API_BASE_URL = `${EnvironmentUtil.isLocalToDevelopment() ? HTTPS_SCHEMA : SCHEMA}://${API_HOST}/credit-card-manager-api`


export interface ResourceAccessApi extends DataApi {
    resourceKey: string,
    domain: string,
    operation: string,
    accountKey: string
}

export interface ResourceAccessRequestApi extends DataApi {
    resourceKey: string,
    domain: string,
    operation: string,
    accountKey: string
}

export interface ResourceAccessAllRequestApi extends DataApi {
    resourceKeyList: string[],
    domain: string,
    operationList: string[],
    accountKey: string
}

export interface ResourceServiceStateProps extends ContexServiceState<ResourceAccessApi> {
    creditCards: CollectionStateProps<ResourceAccessApi>
    purchases: CollectionStateProps<ResourceAccessApi>
}

export interface ResourceServiceProps {
    authenticationService: AuthenticationService
}


export const SHARE_WITH_LIST = [
    {
        key: 'samuel.jansenn@gmail.com',
        fullName: 'Samuel Jansen'
    },
    {
        key: 'nandapadilhas@gmail.com',
        fullName: 'Fernanda Padilhas S.'
    },
    {
        key: 'maeljansen@gmail.com',
        fullName: 'Ismael Jansen'
    },
    {
        key: 'walter.jansenn@gmail.com',
        fullName: 'Walter Jansen'
    },
    {
        key: 'rosane.adina.jansen@gmail.com',
        fullName: 'Rosane A. S. Jansen'
    }
]
export const OPERATION_LIST = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
export const DOMAIN = {
    PURCHASE: 'Purchase'
}


export class ResourceService extends ContexState<ResourceServiceStateProps> implements ResourceServiceProps {

    authenticationService: AuthenticationService
    creditCardsCollectionExecutor: DataCollectionExecutor<ResourceAccessApi, ResourceAccessRequestApi>
    purchasesCollectionExecutor: DataCollectionExecutor<ResourceAccessApi, ResourceAccessAllRequestApi>

    constructor(props: ResourceServiceProps) {
        super()
        this.state = {
            ...this.state,
            ...{
                creditCards: {} as CollectionStateProps<ResourceAccessApi>,
                purchases: {} as CollectionStateProps<ResourceAccessApi>
            }
        } as ResourceServiceStateProps
        this.authenticationService = props.authenticationService
        this.creditCardsCollectionExecutor = new DataCollectionExecutor<ResourceAccessApi, ResourceAccessRequestApi>({
            url: `${API_BASE_URL}/resource/share/credit-card/all`, 
            stateName: `creditCards`, 
            service: this,
            authenticationService: this.authenticationService
        })
        this.purchasesCollectionExecutor = new DataCollectionExecutor<ResourceAccessApi, ResourceAccessAllRequestApi>({
            url: `${API_BASE_URL}/resource/share/purchase/all`, 
            stateName: `purchases`, 
            service: this,
            authenticationService: this.authenticationService
        })
    }

    // shareCreditCardCollection = (newAccesses: ResourceAccessRequestApi[], callback?: CallableFunction) : ResourceAccessApi[] => {
    //     return this.creditCardsCollectionExecutor.postDataCollection(newAccesses, {}, callback ? callback: ()=>{})
    // }

    sharePurchaseCollection = (newAccesses: ResourceAccessAllRequestApi[], props: { callback?: CallableFunction }) : ResourceAccessApi[] => {
        return this.purchasesCollectionExecutor.postDataCollection(newAccesses, {}, props.callback)
    }
    
}

export const ResourceServiceProvider = (props: ResourceServiceProps) => new ResourceService(props)