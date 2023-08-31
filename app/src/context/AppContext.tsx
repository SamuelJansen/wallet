import { createContext } from 'react'
import { PageManager, PageManagerProvider } from '../manager/PageManager'
import { BalanceManager, BalanceManagerProvider } from '../manager/BalanceManager'
import { InvestmentManager, InvestmentManagerProvider } from '../manager/InvestmentManager'
import { AuthenticationService, AuthenticationServiceProvider } from '../service/AuthenticationService'
import { BalanceService, BalanceServiceProvider } from '../service/BalanceService'
import { InvestmentService, InvestmentServiceProvider } from '../service/InvestmentService'
import { StyleService, StyleServiceProvider } from '../service/StyleService'
import { CreditCardManager, CreditCardManagerProvider } from '../manager/CreditCardManager'
import { PurchaseService, PurchaseServiceProvider } from '../service/PurchaseService'
import { InvoiceManager, InvoiceManagerProvider } from '../manager/InvoiceManager'
import { ResourceService, ResourceServiceProvider } from '../service/ResourceService'
import { ResourceManager, ResourceManagerProvider } from '../manager/ResourceManager'
import { InvoiceService, InvoiceServiceProvider } from '../service/InvoiceService'
import { CreditCardService, CreditCardServiceProvider } from '../service/CreditCardService'
import { PageService, PageServiceProvider } from '../service/PageService'
import { useContextState } from '../context-manager/ContextState'


export interface AppContextProps {

  styleService: StyleService,
  authenticationService: AuthenticationService,
  resourceService: ResourceService,
  balanceService: BalanceService,
  investmentService: InvestmentService,
  invoiceService: InvoiceService,
  creditCardService: CreditCardService,
  pageService: PageService,

  resourceManager: ResourceManager,
  balanceManager: BalanceManager,
  investmentManager: InvestmentManager,
  invoiceManager: InvoiceManager,
  creditCardManager: CreditCardManager,
  pageManager: PageManager
  
}

export const AppContext = createContext<AppContextProps | any>({})


export const provideAppContext = (): AppContextProps => {
  const styleService = useContextState<StyleService>(() => StyleServiceProvider())
  const authenticationService = useContextState<AuthenticationService>(() => AuthenticationServiceProvider())
  const resourceService = useContextState<ResourceService>(() => ResourceServiceProvider({ authenticationService }))
  const balanceService = useContextState<BalanceService>(() => BalanceServiceProvider({ authenticationService }))
  const investmentService = useContextState<InvestmentService>(() => InvestmentServiceProvider({ authenticationService }))
  const invoiceService = useContextState<InvoiceService>(() => InvoiceServiceProvider({ authenticationService }))
  const purchaseService = useContextState<PurchaseService>(() => PurchaseServiceProvider({ authenticationService }))
  const creditCardService = useContextState<CreditCardService>(() => CreditCardServiceProvider({ authenticationService }))
  const pageService = useContextState<PageService>(() => PageServiceProvider({ authenticationService }))

  const resourceManager = useContextState<ResourceManager>(() => ResourceManagerProvider({ styleService, resourceService, installmentService: invoiceService }))
  const balanceManager = useContextState<BalanceManager>(() => BalanceManagerProvider({ styleService, balanceService }))
  const investmentManager = useContextState<InvestmentManager>(() => InvestmentManagerProvider({ styleService, investmentService }))
  const invoiceManager = useContextState<InvoiceManager>(() => InvoiceManagerProvider({ styleService, pageService, purchaseService, invoiceService, resourceManager }))
  const creditCardManager = useContextState<CreditCardManager>(() => CreditCardManagerProvider({ styleService, creditCardService, invoiceManager, resourceManager }))
  const pageManager = useContextState<PageManager>(() => PageManagerProvider({ styleService, pageService, balanceManager, investmentManager, creditCardManager }))

  invoiceManager.setCreditCardManager(creditCardManager)

  pageService.setManager(pageManager)

  return {
    styleService,
    authenticationService,
    resourceService,
    balanceService,
    investmentService,
    invoiceService,
    creditCardService,
    pageService,
    resourceManager,
    balanceManager,
    investmentManager,
    invoiceManager,
    creditCardManager,
    pageManager,
  }
} 