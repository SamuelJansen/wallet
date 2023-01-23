import * as ToggleGroup from '@radix-ui/react-toggle-group'

import { ContexState, ManagerState } from "../context-manager/ContextState"
import { StyleService } from "../service/StyleService"
import { PAGES, PageService } from "../service/PageService"
import { BalanceManager } from "../manager/BalanceManager"
import { InvestmentManager } from "../manager/InvestmentManager"
import { CreditCardManager } from './CreditCardManager'


export interface PageManagerStateProps extends ManagerState {
}

export interface PageManagerProps {
    styleService: StyleService
    pageService: PageService

    balanceManager: BalanceManager
    investmentManager: InvestmentManager
    creditCardManager: CreditCardManager
}

export class PageManager extends ContexState<PageManagerStateProps> implements PageManagerProps {
    
    styleService: StyleService
    pageService: PageService
    
    balanceManager: BalanceManager
    investmentManager: InvestmentManager
    creditCardManager: CreditCardManager
    
    pages: any
    
    constructor(props: PageManagerProps) {
        super()
        this.styleService = props.styleService
        this.pageService = props.pageService

        this.balanceManager = props.balanceManager
        this.investmentManager = props.investmentManager
        this.creditCardManager = props.creditCardManager
        
        this.pages = {
            [PAGES.BALANCE_PAGE_NAME]: {
                getData: () => this.balanceManager.getBalances(),
                renderPage: () => this.balanceManager.renderBalances(),
                reRenderPage: () => {
                    this.balanceManager.getBalances()
                    this.balanceManager.renderBalances()
                }
            },
            [PAGES.INVESTMENT_PAGE_NAME]: {
                getData: () => this.investmentManager.getInvestments(),
                renderPage: () => this.investmentManager.renderInvestments(),
                reRenderPage: () => {
                    this.investmentManager.getInvestments()
                    this.investmentManager.renderInvestments()
                }
            },
            [PAGES.CREDIT_CARD_PAGE_NAME]: {
                getData: () => this.creditCardManager.getCreditCards(),
                renderPage: () => this.creditCardManager.renderCreditCards(),
                reRenderPage: () => {
                    this.creditCardManager.getCreditCards()
                    this.creditCardManager.renderCreditCards()
                }
            }
        }

        this.state = {
            ...this.state
        } as PageManagerStateProps
    }

    renderIconPages = () => {
        return this.pageService.getAuthorizedPages().map((pageName: string, index: number) => {
            return (
                <ToggleGroup.Item
                    key={index} 
                    value={pageName}
                    className={`w-[100px] h-full mr-4 ${this.pageService.isSelectedPage(pageName) ? this.styleService.getTWBorder() : ''} flex justify-center items-center ${this.styleService.getTWTextColor()}`}
                    onClick={() => this.pages[pageName].getData() }
                >
                    <span>{pageName}</span>
                </ToggleGroup.Item>
            )
        })
    }

    renderPageSelector = () => {
        return (
            <ToggleGroup.Root
                type='single'
                value={this.pageService.getSelectedPage()}
                onValueChange={(pageName: string) => {
                    pageName!! && this.pageService.setSelectedPage(pageName)
                }}
                className='w-full h-full py-[0.3rem] flex justify-start items-center'
            >
                {this.renderIconPages()}
            </ToggleGroup.Root>
        )
    }

    renderSelectedPage = () => {
        return this.renderPage(this.pageService.getSelectedPage())
    }

    renderPage = (pageName: string) => {
        return !!Object.keys(this.pages).find(p => pageName === p) && this.pages[pageName].renderPage()
    }

    reRenderSelectedPage = () => {
        const pageName = this.pageService.getSelectedPage()
        return !!Object.keys(this.pages).find(p => pageName === p) && this.pages[pageName].reRenderPage()
    }
}

export const PageManagerProvider = (props: PageManagerProps) => new PageManager(props)