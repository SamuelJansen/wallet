import './styles/main.css'

import { AppContext, AppContextProps } from './context/AppContext'
import { TopbarComponent } from './component/topbar/TopbarComponent'
import { useContextState } from './context-manager/ContextState'
import { StyleService, StyleServiceProvider } from './service/StyleService'
import { AuthenticationService, AuthenticationServiceProvider } from './service/AuthenticationService'
import { PageService, PageServiceProvider } from './service/PageService'
import { PageManager, PageManagerProvider } from './manager/PageManager'
import { BalanceService, BalanceServiceProvider } from './service/BalanceService'
import { BalanceManager, BalanceManagerProvider } from './manager/BalanceManager'
import { InvestmentService, InvestmentServiceProvider } from './service/InvestmentService'
import { InvestmentManager, InvestmentManagerProvider } from './manager/InvestmentManager'
import { CreditCardService, CreditCardServiceProvider } from './service/CreditCardService'
import { CreditCardManager, CreditCardManagerProvider } from './manager/CreditCardManager'
import { InvoiceService, InvoiceServiceProvider } from './service/InvoiceService'
import { InvoiceManager, InvoiceManagerProvider } from './manager/InvoiceManager'
import { ResourceService, ResourceServiceProvider } from './service/ResourceService'
import { ResourceManager, ResourceManagerProvider } from './manager/ResourceManager'

export const App = () => {

  const styleService = useContextState<StyleService>(() => StyleServiceProvider())
  const authenticationService = useContextState<AuthenticationService>(() => AuthenticationServiceProvider())
  const resourceService = useContextState<ResourceService>(() => ResourceServiceProvider({ authenticationService }))
  const balanceService = useContextState<BalanceService>(() => BalanceServiceProvider({ authenticationService }))
  const investmentService = useContextState<InvestmentService>(() => InvestmentServiceProvider({ authenticationService }))
  const invoiceService = useContextState<InvoiceService>(() => InvoiceServiceProvider({ authenticationService }))
  const creditCardService = useContextState<CreditCardService>(() => CreditCardServiceProvider({ authenticationService }))
  const pageService = useContextState<PageService>(() => PageServiceProvider({ authenticationService }))

  const resourceManager = useContextState<ResourceManager>(() => ResourceManagerProvider({ styleService, resourceService, installmentService: invoiceService }))
  const balanceManager = useContextState<BalanceManager>(() => BalanceManagerProvider({ styleService, balanceService }))
  const investmentManager = useContextState<InvestmentManager>(() => InvestmentManagerProvider({ styleService, investmentService }))
  const invoiceManager = useContextState<InvoiceManager>(() => InvoiceManagerProvider({ styleService, pageService, invoiceService, resourceManager }))
  const creditCardManager = useContextState<CreditCardManager>(() => CreditCardManagerProvider({ styleService, creditCardService, invoiceManager, resourceManager }))
  const pageManager = useContextState<PageManager>(() => PageManagerProvider({ styleService, pageService, balanceManager, investmentManager, creditCardManager }))

  pageService.setManager(pageManager)

  const appBeans: AppContextProps = {
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

  return (
    <AppContext.Provider value={{ ...appBeans }}>
      <div className={`absolute w-screen h-auto min-h-screen m-0 flex flex-col ${styleService.getTWBackgroundColor()}`}>
        <TopbarComponent />
        <div className='w-100 h-100 flex flex-col pt-2'>
          {pageManager.renderSelectedPage()}
        </div>
      </div>
    </AppContext.Provider>
  )
}