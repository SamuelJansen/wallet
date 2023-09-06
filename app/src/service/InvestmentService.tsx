import { ContexState } from "../context-manager/ContextState";
import { DataApi } from "../framework/DataApi";
import { CollectionStateProps, ContexServiceState, DataCollectionExecutor } from "../framework/DataCollectionExecutor";
import { ENVIRONEMNT_KEYS } from "../util/environment/EnvironmentKeys";
import { EnvironmentUtil } from "../util/environment/EnvironmentUtil";
import { AuthenticationService } from "./AuthenticationService";


const HTTPS_SCHEMA = `https`
const SCHEMA = EnvironmentUtil.isLocal() || EnvironmentUtil.isLocalToDevelopment() ? `http` : HTTPS_SCHEMA
const BASE_HOST = EnvironmentUtil.isLocal() || EnvironmentUtil.isLocalToDevelopment() ? `localhost` : EnvironmentUtil.get(ENVIRONEMNT_KEYS.BASE_HOST)
// const SITE_HOST = EnvironmentUtil.isLocal() || EnvironmentUtil.isLocalToDevelopment() ? `${BASE_HOST}:7890` : `studies.${BASE_HOST}` 
const API_HOST = EnvironmentUtil.isDevelopment() || EnvironmentUtil.isLocalToDevelopment() ? EnvironmentUtil.get(ENVIRONEMNT_KEYS.INVESTMENT_API_HOST) : `${BASE_HOST}:7893` 
const API_BASE_URL = `${EnvironmentUtil.isLocalToDevelopment() ? HTTPS_SCHEMA : SCHEMA}://${API_HOST}/finances-manager-api`


export interface InvestmentApi extends DataApi {
    value: number
    risk: number
}

export interface InvestmentRequestApi extends DataApi {
}

export interface InvestmentReturnReportApi {
    transactionAt: string
    value: number
}

export interface InvestmentReturnsReportApi extends DataApi {
    label: string
    expected: InvestmentReturnReportApi[]
    executed: InvestmentReturnReportApi[]
}

export interface InvestmentReportApi extends DataApi {
    balance: string
    label: string
    value: number
    type: string
    risk: number
    returns: InvestmentReturnsReportApi
}

export interface InvestmentReportRequestApi extends DataApi {
}

export interface InvestmentServiceProps {
    authenticationService: AuthenticationService
}

export interface InvestmentsStateProps extends ContexServiceState<InvestmentApi> {
    invoices: CollectionStateProps<InvestmentApi>
}

export interface InvestmentReportsStateProps extends ContexServiceState<InvestmentReportApi> {
    instalments: CollectionStateProps<InvestmentReportApi>
}

export class InvestmentService extends ContexState<InvestmentsStateProps | InvestmentReportsStateProps> implements InvestmentServiceProps {

    authenticationService: AuthenticationService
    investmentsCollectionExecutor: DataCollectionExecutor<InvestmentApi, InvestmentRequestApi>
    investmentReportsCollectionExecutor: DataCollectionExecutor<InvestmentReportApi, InvestmentReportRequestApi>

    constructor(props: InvestmentServiceProps) {
        super()
        this.authenticationService = props.authenticationService
        this.state = {
            ...this.state
        } as InvestmentsStateProps | InvestmentReportsStateProps
        this.investmentsCollectionExecutor = new DataCollectionExecutor<InvestmentApi, InvestmentRequestApi>({
            url: `${API_BASE_URL}/investment/all`, 
            stateName: `investments`, 
            service: this as ContexState<InvestmentsStateProps>,
            authenticationService: this.authenticationService
        })
        this.investmentReportsCollectionExecutor = new DataCollectionExecutor<InvestmentReportApi, InvestmentReportRequestApi>({
            url: `${API_BASE_URL}/investment/report/all`, 
            stateName: `investmentReports`, 
            service: this as  ContexState<InvestmentReportsStateProps>,
            authenticationService: this.authenticationService
        })
    }

    getCachedInvestments = () : InvestmentApi[] => {
        return this.investmentsCollectionExecutor.accessCachedDataCollection()
    }

    getInvestments = () : InvestmentApi[] => {
        return this.investmentsCollectionExecutor.getDataCollection()
    }

    getCachedInvestmentReports = () : InvestmentReportApi[] => {
        return this.investmentReportsCollectionExecutor.accessCachedDataCollection()
    }

    getInvestmentReports = () : InvestmentReportApi[] => {
        return this.investmentReportsCollectionExecutor.getDataCollection()
    }
    
}

export const InvestmentServiceProvider = (props: InvestmentServiceProps) => new InvestmentService(props)