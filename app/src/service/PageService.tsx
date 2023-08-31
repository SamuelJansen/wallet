import { ContexState, ServiceState } from "../context-manager/ContextState";
import { StorageUtil } from "../util/storage/StorageUtil";
import { STORAGE_KEYS } from "../util/storage/SotrageKeys";
import { AuthenticationService } from "./AuthenticationService"
import { PageManager } from "../manager/PageManager";

export const PAGES = {
    BALANCE_PAGE_NAME: 'balances',
    INVESTMENT_PAGE_NAME: 'investments',
    CREDIT_CARD_PAGE_NAME: 'credit-card'
}
export const BALANCE_PAGE_NAME = 'balances' 
export const INVESTMENT_PAGE_NAME = 'investments' 
export const CREDIT_CARD_PAGE_NAME = 'credit-card'
export const DEFAULT_PAGE_NAME = BALANCE_PAGE_NAME
export const PAGES_NAMES = [
    PAGES.BALANCE_PAGE_NAME,
    // PAGES.INVESTMENT_PAGE_NAME,
    PAGES.CREDIT_CARD_PAGE_NAME
]


export interface PageServiceStateProps extends ServiceState {
    selectedPage: string
}
export interface PageServiceProps {
    authenticationService: AuthenticationService
}


export class PageService extends ContexState<PageServiceStateProps> {

    authenticationService: AuthenticationService
    manager: PageManager | null

    pages: string[]

    constructor(props: PageServiceProps) {
        super()
        this.authenticationService = props.authenticationService
        this.state = {
            ...this.state,
            ...{selectedPage: this.getCurrentPage()}
        } as PageServiceStateProps
        this.pages = PAGES_NAMES.map((pageName, index) => { return pageName })
        this.manager = null
    }

    getCurrentPageKey = () => {
        return `${this.authenticationService.getUserIdentifier()}-${STORAGE_KEYS.CURRENT_PAGE_KEY}`
    }
    
    setCurrentPage = (pageName: string) => {
        this.setState({selectedPage: pageName})
        StorageUtil.set(this.getCurrentPageKey(), pageName)
    }
    
    getCurrentPage = (orDefault: any = DEFAULT_PAGE_NAME) => {
        return StorageUtil.get(this.getCurrentPageKey(), orDefault=orDefault)
    }

    getAuthorizedPages = () => {
        // return this.authenticationService.isAuthorized() ? Object.keys(this.pages) : []
        return this.authenticationService.isAuthorized() ? this.pages : []
    }

    setSelectedPage = (pageName: string) => {
        this.setCurrentPage(pageName)
        return this.getSelectedPage()
    }

    getSelectedPage = () => {
        return this.state.selectedPage
    }

    isSelectedPage = (pageName: string) => {
        return this.state.selectedPage === pageName
    }

    setManager = (manager: PageManager) => {
        this.manager = manager
        return this.getManager()
    }

    getManager = () => {
        return this.manager
    }
    
}

export const PageServiceProvider = (props: PageServiceProps): PageService => new PageService(props)