import * as ToggleGroup from '@radix-ui/react-toggle-group'

import { ContexState, State } from "../context-manager/ContextState"
import { StyleService } from "../service/StyleService"
import { PAGES, PageService } from "../service/PageService"
import { BalanceManager } from "../manager/BalanceManager"
import { InvestmentManager } from "../manager/InvestmentManager"
import { CreditCardManager } from './CreditCardManager'
import { Bank, CreditCard } from '@phosphor-icons/react'
import { ObjectUtil } from '../util/ObjectUtil'


export interface PageManagerStateProps extends State {
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
    
    pages: {
        [key: string]: any
    }
    
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
                reloadData: () => {
                    this.balanceManager.getBalances()
                }
            },
            [PAGES.INVESTMENT_PAGE_NAME]: {
                getData: () => this.investmentManager.getInvestments(),
                renderPage: () => this.investmentManager.renderInvestments(),
                reloadData: () => {
                    this.investmentManager.getInvestments()
                }
            },
            [PAGES.CREDIT_CARD_PAGE_NAME]: {
                getData: () => this.creditCardManager.getCreditCards(),
                renderPage: () => this.creditCardManager.renderCreditCards(),
                reloadData: () => {
                    this.creditCardManager.getCreditCards({ keyList: [], date: this.creditCardManager.getDate()})
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
                    // className={`w-[50px] h-full mr-4 ${this.pageService.isSelectedPage(pageName) ? this.styleService.getTWBorder() : ''} flex justify-center items-center ${this.styleService.getTWTextColor()}`}
                    className={`w-[30px] h-full mr-4 flex justify-center items-center ${this.styleService.getTWTextColor()}`}
                    onClick={() => this.pageService.isSelectedPage(pageName) ? this.pages[pageName].reloadData() : this.pages[pageName].getData() }
                >
                    {
                        ObjectUtil.equals(PAGES.CREDIT_CARD_PAGE_NAME, pageName) ?
                        <CreditCard 
                            id={'access-credit-card'}
                            key={pageName}
                            size={this.styleService.getIconSize()} 
                            color={this.pageService.isSelectedPage(pageName) ? this.styleService.getMainButtonColor() : this.styleService.getBasicButtonColor()}
                        /> :
                        <Bank
                            key={pageName}
                            id={'access-balance'}
                            size={this.styleService.getIconSize()} 
                            color={this.pageService.isSelectedPage(pageName) ? this.styleService.getMainButtonColor() : this.styleService.getBasicButtonColor()}
                        />
                    }
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
}

export const PageManagerProvider = (props: PageManagerProps) => new PageManager(props)