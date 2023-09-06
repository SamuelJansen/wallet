import { ContexState } from "../context-manager/ContextState";
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
    shareCreditCards: CollectionStateProps<ResourceAccessApi>
    transferCreditCards: CollectionStateProps<ResourceAccessApi>
    sharePurchases: CollectionStateProps<ResourceAccessApi>
    transferPurchases: CollectionStateProps<ResourceAccessApi>
}

export interface ResourceServiceProps {
    authenticationService: AuthenticationService
}


export const CONTACT_LIST = [
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
    PURCHASE: 'Purchase',
    CREDIT_CARD: 'CreditCard',
    CREDIT: 'Credit'
}


export class ResourceService extends ContexState<ResourceServiceStateProps> implements ResourceServiceProps {

    authenticationService: AuthenticationService
    shareCreditCardCollectionExecutor: DataCollectionExecutor<ResourceAccessApi, ResourceAccessAllRequestApi>
    transferCreditCardCollectionExecutor: DataCollectionExecutor<ResourceAccessApi, ResourceAccessAllRequestApi>
    sharePurchaseCollectionExecutor: DataCollectionExecutor<ResourceAccessApi, ResourceAccessAllRequestApi>
    transferPurchaseCollectionExecutor: DataCollectionExecutor<ResourceAccessApi, ResourceAccessAllRequestApi>

    constructor(props: ResourceServiceProps) {
        super()
        this.state = {
            ...this.state,
            ...{
                shareCreditCards: {} as CollectionStateProps<ResourceAccessApi>,
                transferCreditCards: {} as CollectionStateProps<ResourceAccessApi>,
                sharePurchases: {} as CollectionStateProps<ResourceAccessApi>,
                transferPurchases: {} as CollectionStateProps<ResourceAccessApi>
            }
        } as ResourceServiceStateProps
        this.authenticationService = props.authenticationService
        this.shareCreditCardCollectionExecutor = new DataCollectionExecutor<ResourceAccessApi, ResourceAccessAllRequestApi>({
            url: `${API_BASE_URL}/resource/share/credit-card/all`, 
            stateName: `shareCreditCards`, 
            service: this,
            authenticationService: this.authenticationService
        })
        this.transferCreditCardCollectionExecutor = new DataCollectionExecutor<ResourceAccessApi, ResourceAccessAllRequestApi>({
            url: `${API_BASE_URL}/resource/transfer/credit-card/all`, 
            stateName: `transferCreditCards`, 
            service: this,
            authenticationService: this.authenticationService
        })
        this.sharePurchaseCollectionExecutor = new DataCollectionExecutor<ResourceAccessApi, ResourceAccessAllRequestApi>({
            url: `${API_BASE_URL}/resource/share/purchase/all`, 
            stateName: `sharePurchases`, 
            service: this,
            authenticationService: this.authenticationService
        })
        this.transferPurchaseCollectionExecutor = new DataCollectionExecutor<ResourceAccessApi, ResourceAccessAllRequestApi>({
            url: `${API_BASE_URL}/resource/transfer/purchase/all`, 
            stateName: `transferPurchases`, 
            service: this,
            authenticationService: this.authenticationService
        })
    }

    shareCreditCardCollection = (newAccesses: ResourceAccessAllRequestApi[], props: { callback?: CallableFunction }) : ResourceAccessApi[] => {
        return this.shareCreditCardCollectionExecutor.postDataCollection(newAccesses, {}, props.callback)
    }

    revokeCreditCardCollection = (accesses: ResourceAccessAllRequestApi[], props: { callback?: CallableFunction }) : ResourceAccessApi[] => {
        return this.shareCreditCardCollectionExecutor.deleteDataCollection(accesses, {}, props.callback)
    }

    transferCreditCardCollection = (accesses: ResourceAccessAllRequestApi[], props: { callback?: CallableFunction }) : ResourceAccessApi[] => {
        return this.transferCreditCardCollectionExecutor.postDataCollection(accesses, {}, props.callback)
    }

    sharePurchaseCollection = (newAccesses: ResourceAccessAllRequestApi[], props: { callback?: CallableFunction }) : ResourceAccessApi[] => {
        return this.sharePurchaseCollectionExecutor.postDataCollection(newAccesses, {}, props.callback)
    }

    revokePurchaseCollection = (accesses: ResourceAccessAllRequestApi[], props: { callback?: CallableFunction }) : ResourceAccessApi[] => {
        return this.sharePurchaseCollectionExecutor.deleteDataCollection(accesses, {}, props.callback)
    }

    transferPurchaseCollection = (accesses: ResourceAccessAllRequestApi[], props: { callback?: CallableFunction }) : ResourceAccessApi[] => {
        return this.transferPurchaseCollectionExecutor.postDataCollection(accesses, {}, props.callback)
    }
    
}

export const ResourceServiceProvider = (props: ResourceServiceProps) => new ResourceService(props)