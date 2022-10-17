import { ContexState } from "../context-manager/ContextState";
import { StorageUtil } from "../util/local-storage/StorageUtil";
import { STORAGE_KEYS } from "../util/local-storage/SotrageKeys";
import { EnvironmentUtil } from '../util/environment/EnvironmentUtil'
import { ReflectionUtil } from '../util/ReflectionUtil'
import { ENVIRONEMNT_KEYS } from '../util/environment/EnvironmentKeys'
import { AuthenticationService } from "./AuthenticationService";


const BASE_URL = "https://studies.data-explore.com/finances-manager-api"

export interface BalanceServiceProps {
    authenticationService: AuthenticationService
}

export interface BalanceApi {
    key: string
    value: number
}

export class BalanceService extends ContexState {

    authenticationService: AuthenticationService
    balances: any

    constructor(props: BalanceServiceProps) {
        super()
        this.authenticationService = props.authenticationService
        this.state = {
            balances: {},
            isLoaded: false
        }
    }

    getCachedBalances = () : BalanceApi[] => {
        return this.authenticationService.isAuthorized() ? this.state.isLoaded ? this._getCachedBalances(this.getState().balances) : this._getAuthorizedBalances() : []
    }

    getBalances = () : BalanceApi[] => {
        return this.authenticationService.isAuthorized() ? this._getAuthorizedBalances() : []
    }

    _getAuthorizedBalances = () => {
        fetch(`${BASE_URL}/balance/all`)
            .then((resp) => resp.json())
            .then((dataList) => this._overrideAuthorizedBalances(dataList))
        return this._getCachedBalances(this.getState().balances)
    }

    _overrideAuthorizedBalances = (balances: BalanceApi[]) => {
        const currentState = this.getState()
        balances.forEach((balanceApi: BalanceApi) => {
            currentState.balances[balanceApi.key] = {
                key: balanceApi.key,
                value: balanceApi.value
            }
        });
        this.setState({balances: currentState.balances, isLoaded: true})
        return this._getCachedBalances(currentState.balances)
    }

    _getCachedBalances = (balancesObject: any) => {
        return Object.values(balancesObject) as BalanceApi[]
    } 
    
}

export const BalanceServiceProvider = (props: BalanceServiceProps) => new BalanceService(props)