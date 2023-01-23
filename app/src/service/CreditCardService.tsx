import { ContexState, ServiceState } from "../context-manager/ContextState";
import { EnvironmentUtil } from '../util/environment/EnvironmentUtil'
import { ENVIRONEMNT_KEYS } from '../util/environment/EnvironmentKeys'
import { AuthenticationService } from "./AuthenticationService";
import { DataCollectionExecutor } from "../framework/DataCollectionExecutor";
import { DataApi } from "../framework/DataApi";


const HTTPS_SCHEMA = `https`
const SCHEMA = EnvironmentUtil.isLocal() || EnvironmentUtil.isLocalToDevelopment() ? `http` : HTTPS_SCHEMA
const BASE_HOST = EnvironmentUtil.isLocal() || EnvironmentUtil.isLocalToDevelopment() ? `localhost` : EnvironmentUtil.get(ENVIRONEMNT_KEYS.BASE_HOST)
const API_HOST = EnvironmentUtil.isDevelopment() || EnvironmentUtil.isLocalToDevelopment() ? EnvironmentUtil.get(ENVIRONEMNT_KEYS.CREDIT_CARD_API_HOST) : `${BASE_HOST}:7897` 
const API_BASE_URL = `${EnvironmentUtil.isLocalToDevelopment() ? HTTPS_SCHEMA : SCHEMA}://${API_HOST}/credit-card-manager-api`

export interface CreditApi extends DataApi  {
    value: number
    limit: number
    currentLimit: number
}
export interface CreditRequestApi extends DataApi  {
}

export interface CreditCardApi extends DataApi {
    value: number
    credit: CreditApi
    closingDay: number
    creditKey: string
    dueDay: number
    expirationDate: string
    label: string
    customLimit: number
}

export interface CreditCardsServiceStateProps {
    [key: string]: CreditCardApi[]
}

export interface CreditCardServiceStateProps extends ServiceState {
    creditCards: CreditCardsServiceStateProps
}

export interface CreditCardServiceProps {
    authenticationService: AuthenticationService
}

export class CreditCardService extends ContexState<CreditCardServiceStateProps> implements CreditCardServiceProps {

    authenticationService: AuthenticationService
    creditCardsCollectionExecutor: DataCollectionExecutor<CreditCardsServiceStateProps, CreditCardApi, CreditRequestApi>

    constructor(props: CreditCardServiceProps) {
        super()
        this.state = {
            ...this.state
        } as CreditCardServiceStateProps
        this.authenticationService = props.authenticationService
        this.creditCardsCollectionExecutor = new DataCollectionExecutor<CreditCardsServiceStateProps, CreditCardApi, CreditRequestApi>({
            url: `${API_BASE_URL}/credit-card/all`, 
            stateName: `creditCards`, 
            service: this,
            authenticationService: this.authenticationService
        })
    }

    getCachedCreditCards = () : CreditCardApi[] => {
        return this.creditCardsCollectionExecutor.accessCachedDataCollection()
    }

    getCreditCards = () : CreditCardApi[] => {
        return this.creditCardsCollectionExecutor.getDataCollection()
    }
    
}

export const CreditCardServiceProvider = (props: CreditCardServiceProps) => new CreditCardService(props)