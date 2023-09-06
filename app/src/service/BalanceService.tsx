import { ContexState } from "../context-manager/ContextState";
import { EnvironmentUtil } from '../util/environment/EnvironmentUtil'
import { ENVIRONEMNT_KEYS } from '../util/environment/EnvironmentKeys'
import { AuthenticationService } from "./AuthenticationService";
import { CollectionStateProps, ContexServiceState, DataCollectionExecutor } from "../framework/DataCollectionExecutor";
import { DataApi } from "../framework/DataApi";


const HTTPS_SCHEMA = `https`
const SCHEMA = EnvironmentUtil.isLocal() || EnvironmentUtil.isLocalToDevelopment() ? `http` : HTTPS_SCHEMA
const BASE_HOST = EnvironmentUtil.isLocal() || EnvironmentUtil.isLocalToDevelopment() ? `localhost` : EnvironmentUtil.get(ENVIRONEMNT_KEYS.BASE_HOST)
const API_HOST = EnvironmentUtil.isDevelopment() || EnvironmentUtil.isLocalToDevelopment() ? EnvironmentUtil.get(ENVIRONEMNT_KEYS.INVESTMENT_API_HOST) : `${BASE_HOST}:7893` 
const API_BASE_URL = `${EnvironmentUtil.isLocalToDevelopment() ? HTTPS_SCHEMA : SCHEMA}://${API_HOST}/finances-manager-api`


export interface BalanceApi extends DataApi {
    value: number
}

export interface BalanceRequestApi extends DataApi {
}

export interface BalanceServiceStateProps extends ContexServiceState<BalanceApi> {
    balances: CollectionStateProps<BalanceApi>
}

export interface BalanceServiceProps {
    authenticationService: AuthenticationService
}

export class BalanceService extends ContexState<BalanceServiceStateProps> implements BalanceServiceProps {

    authenticationService: AuthenticationService
    balancesCollectionExecutor: DataCollectionExecutor<BalanceApi, BalanceRequestApi>

    constructor(props: BalanceServiceProps) {
        super()
        this.state = {
            ...this.state
        } as BalanceServiceStateProps
        this.authenticationService = props.authenticationService
        this.balancesCollectionExecutor = new DataCollectionExecutor<BalanceApi, BalanceRequestApi>({
            url: `${API_BASE_URL}/balance/all`, 
            stateName: `balances`, 
            service: this,
            authenticationService: this.authenticationService
        })
    }

    getCachedBalances = () : BalanceApi[] => {
        return this.balancesCollectionExecutor.accessCachedDataCollection()
    }

    getBalances = () : BalanceApi[] => {
        return this.balancesCollectionExecutor.getDataCollection()
    }
    
}

export const BalanceServiceProvider = (props: BalanceServiceProps) => new BalanceService(props)