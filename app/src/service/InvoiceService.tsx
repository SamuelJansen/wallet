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
const API_HOST = EnvironmentUtil.isDevelopment() || EnvironmentUtil.isLocalToDevelopment() ? EnvironmentUtil.get(ENVIRONEMNT_KEYS.CREDIT_CARD_API_HOST) : `${BASE_HOST}:7897` 
const API_BASE_URL = `${EnvironmentUtil.isLocalToDevelopment() ? HTTPS_SCHEMA : SCHEMA}://${API_HOST}/credit-card-manager-api`


export interface InvoiceQueryApi {
    creditCardKeyList: (string | null)[],
    date: string
} 

export interface InstallmentQueryApi {
    keyList: (string | null)[]
}

export enum INSTALLMENT_STATUS {
    CREATED = "CREATED",
    SCHEADULED = "SCHEADULED",
    PROCESSING = "PROCESSING",
    PROCESSED = "PROCESSED",
    REVERTED = "REVERTED",
    ERROR = "ERROR",
    NONE = "NONE"
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

export interface InstallmentApi extends DataApi {
    installmentAt: string,
    installments: number,
    label: string,
    value: number,
    order: 0,
    status: INSTALLMENT_STATUS,
    purchaseKey: string,
    purchase: PurchaseApi
}

export interface InvoiceApi extends DataApi {
    creditCard: CreditCardApi,
    installmentList: InstallmentApi[],
    value: number,
    closeAt: string,
    dueAt: string
}

export interface InvoiceRequestApi extends DataApi {
}

export interface InstallmentRequestApi extends DataApi {
}

export interface InvoiceServiceStateProps extends ServiceState {
    invoice: InvoiceApi
}

export interface InstallmentServiceStateProps extends ServiceState {
    installment: InstallmentApi
}

export interface InvoiceServiceProps {
    authenticationService: AuthenticationService
}

export class InvoiceService extends ContexState<InvoiceServiceStateProps> implements InvoiceServiceProps {

    authenticationService: AuthenticationService
    invoices: DataCollectionExecutor<InvoiceServiceStateProps, InvoiceApi, InvoiceRequestApi>
    instalments: DataCollectionExecutor<InvoiceServiceStateProps, InstallmentApi, InstallmentRequestApi>

    constructor(props: InvoiceServiceProps) {
        super()
        this.state = {
            ...this.state
        } as InvoiceServiceStateProps
        this.authenticationService = props.authenticationService
        this.invoices = new DataCollectionExecutor<InvoiceServiceStateProps, InvoiceApi, InvoiceRequestApi>({
            url: `${API_BASE_URL}/invoice/all`, 
            stateName: `invoice`, 
            service: this,
            authenticationService: this.authenticationService
        })
        this.instalments = new DataCollectionExecutor<InstallmentServiceStateProps, InstallmentApi, InstallmentRequestApi>({
            url: `${API_BASE_URL}/installment/all`, 
            stateName: `instalment`, 
            service: this,
            authenticationService: this.authenticationService
        })
    }

    getInvoicesState = (query?: InvoiceQueryApi) : InvoiceApi[] => {
        return this.invoices.accessCachedDataCollection(query ? {
            query: query
        } : {})
    }

    getInvoices = (query?: InvoiceQueryApi) : InvoiceApi[] => {
        return this.invoices.getDataCollection(query ? {
            query: query
        } : {})
    }

    proccessAll = (query?: InstallmentQueryApi, callback?: CallableFunction) : InstallmentApi[] => {
        return this.instalments.patchDataCollection(
            [], 
            query ? {
                query: query
            } : {},
            callback
        )
    }
    
}

export const InvoiceServiceProvider = (props: InvoiceServiceProps) => new InvoiceService(props)