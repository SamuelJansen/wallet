import './styles/main.css'
import { AppContext, provideAppContext } from './context/AppContext'
import { TopbarComponent } from './component/topbar/TopbarComponent'


export const App = () => {
  const appContext = provideAppContext()
  return (
    <AppContext.Provider value={{ ...appContext }}>
      <div className={`absolute w-screen h-auto min-h-screen m-0 flex flex-col ${appContext.styleService.getTWBackgroundColor()}`}>
        <TopbarComponent />
        <div className='w-100 h-100 flex flex-col pt-2'>
          {appContext.pageManager.renderSelectedPage()}
        </div>
      </div>
    </AppContext.Provider>
  )
}