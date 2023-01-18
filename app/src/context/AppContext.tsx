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

export const AppContext = createContext({

    styleService: StyleService,
    authenticationService: AuthenticationService,
    resourceService: ResourceService,
    balanceService: BalanceService,
    investmentService: InvestmentService,

    resourceManager: ResourceManager,
    balanceManager: BalanceManager,
    investmentManager: InvestmentManager,
    invoiceManager: InvoiceManager,
    creditCardManager: CreditCardManager,
    pageManager: PageManager
    
  })