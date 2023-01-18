import { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import { PageManager } from "../../manager/PageManager";
import { StyleService } from "../../service/StyleService";
import { AuthenticationComponent } from "../authentication/AuthenticationComponent";


export const TOPBAR_DIMMENTONS = 40
export const BORDER_WIDTH = 2
const TOPBAR_TAILWIND_DIMMENTONS = `w-full h-10` //-> `w-full h-${parseInt(`${TOPBAR_DIMMENTONS/4}`, 10)}`
const TOPBAR_BACKGROUND_COLOR = 'bg-black'

export const TopbarComponent = () => {
    
    const { 
        styleService, 
        pageManager 
    } : { 
        styleService: StyleService, 
        pageManager: PageManager 
    } = useContext<any>(AppContext)

    return (
        <div className={`${TOPBAR_TAILWIND_DIMMENTONS} flex flex-col z-50`}>

            <div className={`fixed ${TOPBAR_TAILWIND_DIMMENTONS} px-2 flex justify-content-between items-center ${TOPBAR_BACKGROUND_COLOR}`}>

                <div className='w-[185px] h-full mr-8 flex justify-start items-center'>
                    <h1 className={`w-full h-full flex justify-center items-center ${styleService.getTWTextColor()} font-bold text-xl`}>
                        wallet
                    </h1>
                </div>

                    {pageManager.renderPageSelector()}

                    <div className='w-full h-full flex justify-end items-center'>
                        <AuthenticationComponent />
                    </div>

            </div>

            <div className={`${TOPBAR_TAILWIND_DIMMENTONS} ${TOPBAR_BACKGROUND_COLOR}`}>
                {/*under topbar filler*/}
            </div>
            
        </div>
    );
};
  


//<div className={`${TOPBAR_TAILWIND_DIMMENTONS} ${TOPBAR_BACKGROUND_COLOR}`}></div>