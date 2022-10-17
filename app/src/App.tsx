import './styles/main.css'

import { AppContext } from './context/AppContext'
import { TopbarComponent } from './component/topbar/TopbarComponent'
import { useContextState } from './context-manager/ContextState'
import { StyleServiceProvider } from './service/StyleService'
import { AuthenticationServiceProvider } from './service/AuthenticationService'
import { PageManagerProvider } from './manager/PageManager'
import { BalanceServiceProvider } from './service/BalanceService'
import { useEffect } from 'react'

export const App = () => {
  const [styleService] = useContextState(() => StyleServiceProvider())
  const [authenticationService] = useContextState(() => AuthenticationServiceProvider())
  const [balanceService] = useContextState(() => BalanceServiceProvider({authenticationService}))
  const [pageManger] = useContextState(() => PageManagerProvider({authenticationService}))

  const getBalances = () => {
    return pageManger.isSelectedPage('balances') ? balanceService.getCachedBalances().map((balance: any) => {
      return (
        <div key={balance.key} className={`w-100 h-[14rem] mt-2 px-2 flex justify-between items-center ${styleService.getTWTextColor()}`}>
          <div
            className={`w-full h-full p-2 flex justify-left items-top bg-black`}
          >
            <span>
              {balance.key}
            </span>
          </div>
          <div className={`w-[180px] h-full ml-2 p-2 flex flex-col justify-top items-left bg-black`}>
            <span>
              R$ {balance.value}
            </span>
          </div>
        </div>
      )
    }) : <></>
  }

  return (
    <AppContext.Provider value={{
      styleService,
      authenticationService,
      balanceService,
      pageManger
    }}>

      <div className={`absolute w-screen h-auto min-h-screen m-0 flex flex-col ${styleService.getTWBackgroundColor()}`}>
        <TopbarComponent />
        <div className='w-100 h-100 flex flex-col'>
          {
            (() => getBalances())()
          }
        </div>
      </div>

    </AppContext.Provider>
  )
}
