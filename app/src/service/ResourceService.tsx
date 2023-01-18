import { ContexState, ServiceState } from "../context-manager/ContextState";
import { EnvironmentUtil } from '../util/environment/EnvironmentUtil'
import { ENVIRONEMNT_KEYS } from '../util/environment/EnvironmentKeys'
import { AuthenticationService } from "./AuthenticationService";
import { DataCollectionExecutor } from "../framework/DataCollectionExecutor";
import { DataApi } from "../framework/DataApi";
import { CreditCardApi } from "./CreditCardService";


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

export interface ResourceServiceStateProps extends ServiceState {
    creditCard: ResourceAccessApi
}

export interface ResourceServiceProps {
    authenticationService: AuthenticationService
}

export class ResourceService extends ContexState<ResourceServiceStateProps> implements ResourceServiceProps {

    authenticationService: AuthenticationService
    creditCards: DataCollectionExecutor<ResourceServiceStateProps, ResourceAccessApi, ResourceAccessRequestApi>

    constructor(props: ResourceServiceProps) {
        super()
        this.state = {
            ...this.state
        } as ResourceServiceStateProps
        this.authenticationService = props.authenticationService
        this.creditCards = new DataCollectionExecutor<ResourceServiceStateProps, ResourceAccessApi, ResourceAccessRequestApi>({
            url: `${API_BASE_URL}/resource/share/credit-card/all`, 
            stateName: `resources-credit-card`, 
            service: this,
            authenticationService: this.authenticationService
        })
    }

    // getCachedResources = () : ResourceAccessApi[] => {
    //     return this.creditCards.accessCachedDataCollection()
    // }

    // getResources = () : ResourceAccessApi[] => {
    //     return this.creditCards.getDataCollection()
    // }

    shareCreditCardCollection = (newAccesses: ResourceAccessRequestApi[]) : ResourceAccessApi[] => {
        return this.creditCards.postDataCollection(newAccesses)
    }
    
}

export const ResourceServiceProvider = (props: ResourceServiceProps) => new ResourceService(props)