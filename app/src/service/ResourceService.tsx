import { ContexState, ServiceState } from "../context-manager/ContextState";
import { EnvironmentUtil } from '../util/environment/EnvironmentUtil'
import { ENVIRONEMNT_KEYS } from '../util/environment/EnvironmentKeys'
import { AuthenticationService } from "./AuthenticationService";
import { DataCollectionExecutor } from "../framework/DataCollectionExecutor";
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

export interface CreditCardResourcesServiceStateProps extends ServiceState {
    [key: string]: ResourceAccessApi[]
}

export interface ResourceServiceStateProps extends ServiceState {
    creditCards: CreditCardResourcesServiceStateProps
}

export interface ResourceServiceProps {
    authenticationService: AuthenticationService
}

export class ResourceService extends ContexState<ResourceServiceStateProps> implements ResourceServiceProps {

    authenticationService: AuthenticationService
    creditCardsCollectionExecutor: DataCollectionExecutor<CreditCardResourcesServiceStateProps, ResourceAccessApi, ResourceAccessRequestApi>

    constructor(props: ResourceServiceProps) {
        super()
        this.state = {
            ...this.state
        } as ResourceServiceStateProps
        this.authenticationService = props.authenticationService
        this.creditCardsCollectionExecutor = new DataCollectionExecutor<CreditCardResourcesServiceStateProps, ResourceAccessApi, ResourceAccessRequestApi>({
            url: `${API_BASE_URL}/resource/share/credit-card/all`, 
            stateName: `creditCards`, 
            service: this,
            authenticationService: this.authenticationService
        })
    }

    shareCreditCardCollection = (newAccesses: ResourceAccessRequestApi[]) : ResourceAccessApi[] => {
        return this.creditCardsCollectionExecutor.postDataCollection(newAccesses)
    }
    
}

export const ResourceServiceProvider = (props: ResourceServiceProps) => new ResourceService(props)