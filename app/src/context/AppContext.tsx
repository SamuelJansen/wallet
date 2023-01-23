import { createContext } from 'react'
import { PageManager } from '../manager/PageManager'
import { BalanceManager } from '../manager/BalanceManager'
import { InvestmentManager } from '../manager/InvestmentManager'
import { AuthenticationService } from '../service/AuthenticationService'
import { BalanceService } from '../service/BalanceService'
import { InvestmentService } from '../service/InvestmentService'
import { StyleService } from '../service/StyleService'
import { CreditCardManager } from '../manager/CreditCardManager'
import { InvoiceManager } from '../manager/InvoiceManager'
import { ResourceService } from '../service/ResourceService'
import { ResourceManager } from '../manager/ResourceManager'
import { InvoiceService } from '../service/InvoiceService'
import { CreditCardService } from '../service/CreditCardService'
import { PageService } from '../service/PageService'


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