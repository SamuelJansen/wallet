import './styles/main.css'

import { AppContext } from './context/AppContext'
import { TopbarComponent } from './component/topbar/TopbarComponent'
import { useContextState } from './context-manager/ContextState'
import { StyleServiceProvider } from './service/StyleService'
import { AuthenticationServiceProvider } from './service/AuthenticationService'
import { PageServiceProvider } from './service/PageService'
import { PageManagerProvider } from './manager/PageManager'
import { BalanceServiceProvider } from './service/BalanceService'
import { BalanceManagerProvider } from './manager/BalanceManager'
import { InvestmentServiceProvider } from './service/InvestmentService'
import { InvestmentManagerProvider } from './manager/InvestmentManager'
import { CreditCardServiceProvider } from './service/CreditCardService'
import { CreditCardManagerProvider } from './manager/CreditCardManager'
import { InvoiceServiceProvider } from './service/InvoiceService'
import { InvoiceManagerProvider } from './manager/InvoiceManager'
import { ResourceServiceProvider } from './service/ResourceService'
import { ResourceManagerProvider } from './manager/ResourceManager'

export const App = () => {
  const [styleService] = useContextState(() => StyleServiceProvider())
  const [authenticationService] = useContextState(() => AuthenticationServiceProvider())
  const [resourceService] = useContextState(() => ResourceServiceProvider({authenticationService}))
  const [balanceService] = useContextState(() => BalanceServiceProvider({authenticationService}))
  const [investmentService] = useContextState(() => InvestmentServiceProvider({authenticationService}))
  const [invoiceService] = useContextState(() => InvoiceServiceProvider({authenticationService}))
  const [creditCardService] = useContextState(() => CreditCardServiceProvider({authenticationService}))
  const [pageService] = useContextState(() => PageServiceProvider({authenticationService}))

  const [resourceManager] = useContextState(() => ResourceManagerProvider({styleService, resourceService, installmentService: invoiceService}))
  const [balanceManager] = useContextState(() => BalanceManagerProvider({styleService, balanceService}))
  const [investmentManager] = useContextState(() => InvestmentManagerProvider({styleService, investmentService}))
  const [invoiceManager] = useContextState(() => InvoiceManagerProvider({styleService, pageService, invoiceService, resourceManager}))
  const [creditCardManager] = useContextState(() => CreditCardManagerProvider({styleService, creditCardService, invoiceManager, resourceManager}))
  const [pageManager] = useContextState(() => PageManagerProvider({styleService, pageService, balanceManager, investmentManager, creditCardManager}))

  pageService.setManager(pageManager)

  return (
    <AppContext.Provider value={{
      styleService,
      authenticationService,
      resourceService,
      balanceService,
      investmentService,

      resourceManager,
      balanceManager,
      investmentManager,
      invoiceManager,
      creditCardManager,
      pageManager
    }}>

      <div className={`absolute w-screen h-auto min-h-screen m-0 flex flex-col ${styleService.getTWBackgroundColor()}`}>
        <TopbarComponent />
        <div className='w-100 h-100 flex flex-col pt-2'>
          {pageManager.renderSelectedPage()}
        </div>
      </div>

    </AppContext.Provider>
  )
}
