import { ContexState, ServiceState } from "../context-manager/ContextState";
import { EnvironmentUtil } from '../util/environment/EnvironmentUtil'
import { ENVIRONEMNT_KEYS } from '../util/environment/EnvironmentKeys'
import { AuthenticationService } from "./AuthenticationService";
import { CollectionStateProps, ContexServiceState, DataCollectionExecutor } from "../framework/DataCollectionExecutor";
import { DataApi, RESOURCE_OPERATIONS } from "../framework/DataApi";
import { CreditCardApi } from "./CreditCardService";
import { ObjectUtil } from "../util/ObjectUtil";
import { PurchaseApi } from "./PurchaseService";


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

export interface InvoiceServiceStateProps extends ContexServiceState<InvoiceApi> {
    invoices: CollectionStateProps<InvoiceApi>
}

export interface InstallmenteServiceStateProps extends ContexServiceState<InstallmentApi> {
    instalments: CollectionStateProps<InstallmentApi>
}

export interface InvoiceServiceProps {
    authenticationService: AuthenticationService
    invoicesCollectionExecutor: DataCollectionExecutor<InvoiceApi, InvoiceRequestApi>
    instalmentsCollectionExecutor: DataCollectionExecutor<InstallmentApi, InstallmentRequestApi>
}

export class InvoiceService extends ContexState<InvoiceServiceStateProps | InstallmenteServiceStateProps> implements InvoiceServiceProps {

    authenticationService: AuthenticationService
    invoicesCollectionExecutor: DataCollectionExecutor<InvoiceApi, InvoiceRequestApi>
    instalmentsCollectionExecutor: DataCollectionExecutor<InstallmentApi, InstallmentRequestApi>

    constructor(props: InvoiceServiceProps) {
        super()
        this.authenticationService = props.authenticationService
        this.state = {
            ...this.state
        } as InvoiceServiceStateProps
        this.invoicesCollectionExecutor = new DataCollectionExecutor<InvoiceApi, InvoiceRequestApi>({
            url: `${API_BASE_URL}/invoice/all`, 
            stateName: `invoices`, 
            service: this as ContexState<InvoiceServiceStateProps>,
            authenticationService: this.authenticationService
        })
        this.instalmentsCollectionExecutor = new DataCollectionExecutor<InstallmentApi, InstallmentRequestApi>({
            url: `${API_BASE_URL}/installment/all`, 
            stateName: `instalments`, 
            service: this as ContexState<InstallmenteServiceStateProps>,
            authenticationService: this.authenticationService
        })
    }

    resetState = (props: {creditCardKeyList: Array<string | null>}) => {
        if (ObjectUtil.isEmpty(props.creditCardKeyList)) {
            this.invoicesCollectionExecutor.clearDataCollection()
            this.instalmentsCollectionExecutor.clearDataCollection()
        } else {
            this.resetInvoiceState({creditCardKeyList: props.creditCardKeyList})
            this.resetInstalmmentState({creditCardKeyList: props.creditCardKeyList})
        }
    }

    resetInvoiceState = (props: {creditCardKeyList: Array<string | null>}) => {
        const invoiceListCopy: Array<InvoiceApi> = this.invoicesCollectionExecutor.accessDataCollection()
        for (let invoice of invoiceListCopy) {
            if (ObjectUtil.containsIt(invoice.creditCard.key, props.creditCardKeyList)) {
                ObjectUtil.popIt(invoice, invoiceListCopy)
            }
        }
        this.invoicesCollectionExecutor.overrideDataCollectionWithPossibleLoss(invoiceListCopy, RESOURCE_OPERATIONS.GET_COLLECTION)
    }
    
    resetInstalmmentState = (props: {creditCardKeyList: Array<string | null>}) => {
        // console.log(this.getState().instalments)
    }

    getInvoicesState = (query?: InvoiceQueryApi) : InvoiceApi[] => {
        return this.invoicesCollectionExecutor.accessCachedDataCollection(query ? {
            query: query
        } : {})
    }

    getInvoices = (query?: InvoiceQueryApi) : InvoiceApi[] => {
        return this.invoicesCollectionExecutor.getDataCollection(query ? {
            query: query
        } : {})
    }

    newPurchase = (purchase: PurchaseApi, query?: InstallmentQueryApi, callback?: CallableFunction) => {
        return this.instalmentsCollectionExecutor.postDataCollection(
            [purchase], 
            query ? {
                query: query
            } : {},
            callback
        )
    }
    
}

export const InvoiceServiceProvider = (props: InvoiceServiceProps) => new InvoiceService(props)