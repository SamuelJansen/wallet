import './styles/main.css'

import { AppContext } from './context/AppContext'
import { TopbarComponent } from './component/topbar/TopbarComponent'
import { useContextState } from './context-manager/ContextState'
import { StyleServiceProvider } from './service/style/StyleService'
import { AuthenticationServiceProvider } from './service/authentication/AuthenticationService'

export const App = () => {
  const [styleService] = useContextState(() => StyleServiceProvider())
  const [authenticationService] = useContextState(() => AuthenticationServiceProvider())
  return (
    <AppContext.Provider value={{
      styleService,
      authenticationService
    }}>

      <div className='absolute w-screen h-auto m-0 flex flex-col bg-yellow-500'>
        <TopbarComponent />
        <div className='w-full h-full flex flex-col text-black'>
          <div className='w-full h-full flex flex-col items-center'>
            <h2>Content Block 1</h2>
            <span>content 1</span>
            <span>content 2</span>
            <span>content 3</span>
            <span>content 4</span>
            <span>content 5</span>
          </div>
          <div className='w-full h-full flex flex-col items-center'>
            <h2>Content Block 2</h2>
            <span>content 1</span>
            <span>content 2</span>
            <span>content 3</span>
            <span>content 4</span>
            <span>content 5</span>
          </div>
          <div className='w-full h-full flex flex-col items-center'>
            <h2>Content Block 3</h2>
            <span>content 1</span>
            <span>content 2</span>
            <span>content 3</span>
            <span>content 4</span>
            <span>content 5</span>
          </div>
          <div className='w-full h-full flex flex-col items-center'>
            <h2>Content Block 4</h2>
            <span>content 1</span>
            <span>content 2</span>
            <span>content 3</span>
            <span>content 4</span>
            <span>content 5</span>
          </div>
          <div className='w-full h-full flex flex-col items-center'>
            <h2>Content Block 1</h2>
            <span>content 1</span>
            <span>content 2</span>
            <span>content 3</span>
            <span>content 4</span>
            <span>content 5</span>
          </div>
          <div className='w-full h-full flex flex-col items-center'>
            <h2>Content Block 5</h2>
            <span>content 1</span>
            <span>content 2</span>
            <span>content 3</span>
            <span>content 4</span>
            <span>content 5</span>
          </div>
        </div>

      </div>

    </AppContext.Provider>
  )
}
