import { ContexState } from "../context-manager/ContextState";
import { EnvironmentUtil } from '../util/environment/EnvironmentUtil'
import { ENVIRONEMNT_KEYS } from '../util/environment/EnvironmentKeys'
import { AuthenticationService } from "./AuthenticationService";
import { CollectionStateProps, ContexServiceState, DataCollectionExecutor } from "../framework/DataCollectionExecutor";
import { DataApi } from "../framework/DataApi";
import { InstallmentApi } from "./InvoiceService";
import { CreditCardApi } from "./CreditCardService";


const HTTPS_SCHEMA = `https`
const SCHEMA = EnvironmentUtil.isLocal() || EnvironmentUtil.isLocalToDevelopment() ? `http` : HTTPS_SCHEMA
const BASE_HOST = EnvironmentUtil.isLocal() || EnvironmentUtil.isLocalToDevelopment() ? `localhost` : EnvironmentUtil.get(ENVIRONEMNT_KEYS.BASE_HOST)
const API_HOST = EnvironmentUtil.isDevelopment() || EnvironmentUtil.isLocalToDevelopment() ? EnvironmentUtil.get(ENVIRONEMNT_KEYS.CREDIT_CARD_API_HOST) : `${BASE_HOST}:7897` 
const API_BASE_URL = `${EnvironmentUtil.isLocalToDevelopment() ? HTTPS_SCHEMA : SCHEMA}://${API_HOST}/credit-card-manager-api`


export interface PurchaseRequestApi extends DataApi {
    label: string,
    value: number,
    purchaseAt: string,
    installments: number,
    creditCardKey: string
}

export interface PurchaseApi extends DataApi {
    label: string,
    value: number,
    purchaseAt: string,
    installments: number,
    creditCard: CreditCardApi,
    creditCardKey: string,
    installmentList: InstallmentApi[]
}

export interface PurchasesServiceStateProps {
    [key: string]: PurchaseApi[]
}

export interface PurchaseServiceStateProps extends ContexServiceState<PurchaseApi> {
    purchases: CollectionStateProps<PurchaseApi>
}

export interface PurchaseServiceProps {
    authenticationService: AuthenticationService
}

export class PurchaseService extends ContexState<PurchaseServiceStateProps> implements PurchaseServiceProps {

    authenticationService: AuthenticationService
    purchasesCollectionExecutor: DataCollectionExecutor<PurchaseApi, PurchaseRequestApi>

    constructor(props: PurchaseServiceProps) {
        super()
        this.state = {
            ...this.state
        } as PurchaseServiceStateProps
        this.authenticationService = props.authenticationService
        this.purchasesCollectionExecutor = new DataCollectionExecutor<PurchaseApi, PurchaseRequestApi>({
            url: `${API_BASE_URL}/purchase/all`, 
            stateName: `purchases`, 
            service: this,
            authenticationService: this.authenticationService
        })
    }

    getCachedPurchases = () : PurchaseApi[] => {
        return this.purchasesCollectionExecutor.accessCachedDataCollection()
    }

    getPurchases = (query?: {keyList: string[]}) : PurchaseApi[] => {
        return this.purchasesCollectionExecutor.getDataCollection({query})
    }

    newPurchaseCollection = (requestCollection: PurchaseRequestApi[], props?: { callback?: CallableFunction }): void => {
        this.purchasesCollectionExecutor.postDataCollection(requestCollection, {}, props?.callback)
    }

    revertPurchaseCollection = (requestCollection: PurchaseRequestApi[], props?: { callback?: CallableFunction }): void => {
        this.purchasesCollectionExecutor.deleteDataCollection(requestCollection, {}, props?.callback)
    }
    
}

export const PurchaseServiceProvider = (props: PurchaseServiceProps) => new PurchaseService(props)