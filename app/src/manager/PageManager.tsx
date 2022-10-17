import { ContexState } from "../context-manager/ContextState";
import { AuthenticationService } from "../service/AuthenticationService";

export const PAGES = [
    "balances",
    "investments"
]

export class PageManager extends ContexState {
    
    authenticationService: AuthenticationService
    
    constructor(props: {authenticationService: AuthenticationService}) {
        super()
        this.authenticationService = props.authenticationService
        this.state = {
            selectedPage: 'balances'
        }
    }

    setSelectedPage = (pageName: string) => {
        this.setState({selectedPage: pageName})
    }

    getSelectedPage = () => {
        return this.state.selectedPage
    }

    isSelectedPage = (pageName: string) => {
        return this.state.selectedPage === pageName
    }

    getAuthorizedPages = () => {
        return this.authenticationService.isAuthorized() ? PAGES : []
    }
}

export const PageManagerProvider = (props: {
    authenticationService: AuthenticationService
}) => new PageManager(props)