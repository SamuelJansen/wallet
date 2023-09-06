import { ContexState } from "../context-manager/ContextState";
import { EnvironmentUtil } from '../util/environment/EnvironmentUtil'
import { ENVIRONEMNT_KEYS } from '../util/environment/EnvironmentKeys'
import { AuthenticationService } from "./AuthenticationService";
import { CollectionStateProps, ContexServiceState, DataCollectionExecutor } from "../framework/DataCollectionExecutor";
import { DataApi } from "../framework/DataApi";


const HTTPS_SCHEMA = `https`
const SCHEMA = EnvironmentUtil.isLocal() || EnvironmentUtil.isLocalToDevelopment() ? `http` : HTTPS_SCHEMA
const BASE_HOST = EnvironmentUtil.isLocal() || EnvironmentUtil.isLocalToDevelopment() ? `localhost` : EnvironmentUtil.get(ENVIRONEMNT_KEYS.BASE_HOST)
const API_HOST = EnvironmentUtil.isDevelopment() || EnvironmentUtil.isLocalToDevelopment() ? EnvironmentUtil.get(ENVIRONEMNT_KEYS.CREDIT_CARD_API_HOST) : `${BASE_HOST}:7897` 
const API_BASE_URL = `${EnvironmentUtil.isLocalToDevelopment() ? HTTPS_SCHEMA : SCHEMA}://${API_HOST}/credit-card-manager-api`

export interface CreditApi extends DataApi  {
    value: number
    limit: number
}
export interface CreditCardRequestApi extends DataApi {
    cardNumber: string
    label: string
    closingDay: number
    dueDay: number
    expirationDate: string
    provider: string
    limit: number
    customLimit: number
    creditKey: string | null
}

export interface CreditCardApi extends DataApi {
    cardNumber: string
    label: string
    value: number
    closingDay: number
    dueDay: number
    expirationDate: string
    provider: string
    limit: number
    customLimit: number
    creditKey: string
    credit: CreditApi
}

export interface CreditCardServiceStateProps extends ContexServiceState<CreditCardApi> {
    creditCards: CollectionStateProps<CreditCardApi>
}

export interface CreditCardServiceProps {
    authenticationService: AuthenticationService
}

export class CreditCardService extends ContexState<CreditCardServiceStateProps> implements CreditCardServiceProps {

    authenticationService: AuthenticationService
    creditCardCollectionExecutor: DataCollectionExecutor<CreditCardApi, CreditCardRequestApi>

    constructor(props: CreditCardServiceProps) {
        super()
        this.state = {
            ...this.state
        } as CreditCardServiceStateProps
        this.authenticationService = props.authenticationService
        this.creditCardCollectionExecutor = new DataCollectionExecutor<CreditCardApi, CreditCardRequestApi>({
            url: `${API_BASE_URL}/credit-card/all`, 
            stateName: `creditCards`, 
            service: this,
            authenticationService: this.authenticationService
        })
    }

    createCreditCards = (creditCardCollection: CreditCardRequestApi[], props?: { callback?: CallableFunction }): CreditCardApi[] => {
        this.creditCardCollectionExecutor.postDataCollection(creditCardCollection, {}, props?.callback)
        return this.creditCardCollectionExecutor.accessCachedDataCollection()
    }

    getCachedCreditCards = (): CreditCardApi[] => {
        return this.creditCardCollectionExecutor.accessCachedDataCollection()
    }

    getCreditCards = (query?: {keyList: string[]}): CreditCardApi[] => {
        return this.creditCardCollectionExecutor.getDataCollection({query})
    }

    revertCreditCardCollection = (requestCollection: CreditCardApi[], props?: { callback?: CallableFunction }): void => {
        this.creditCardCollectionExecutor.deleteDataCollection(requestCollection, {}, props?.callback)
    }
    
}

export const CreditCardServiceProvider = (props: CreditCardServiceProps) => new CreditCardService(props)