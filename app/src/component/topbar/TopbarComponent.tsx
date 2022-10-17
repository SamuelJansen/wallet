import { useContext, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { AuthenticationComponent } from "../authentication/AuthenticationComponent";
import * as ToggleGroup from '@radix-ui/react-toggle-group'


export const TOPBAR_DIMMENTONS = 32
export const BORDER_WIDTH = 2
const TOPBAR_TAILWIND_DIMMENTONS = `w-full h-8`
const TOPBAR_BACKGROUND_COLOR = 'bg-black'

export const TopbarComponent = () => {
    
    const { styleService, authenticationService, balanceService, pageManger } = useContext<any>(AppContext)

    const getPages = () => {
        return pageManger.getAuthorizedPages().map((pageName: string, index: number) => {
            return (
                <ToggleGroup.Item
                    key={index} 
                    value={pageName}
                    className={`w-[100px] h-full mr-4 ${pageManger.isSelectedPage(pageName) ? styleService.getTWBorder() : ''} flex justify-center items-center ${styleService.getTWTextColor()}`}
                    onClick={() => pageName==='balances' ? balanceService.getBalances() : () => {} }
                >
                    <span>{pageName}</span>
                </ToggleGroup.Item>
            )
        })
    }

    return (
        <div className={`${TOPBAR_TAILWIND_DIMMENTONS} flex flex-col`}>

            <div className={`fixed ${TOPBAR_TAILWIND_DIMMENTONS} px-2 flex justify-content-between items-center ${TOPBAR_BACKGROUND_COLOR}`}>

                <div className='w-[185px] h-full mr-8 flex justify-start items-center'>
                    <h1 className={`w-full h-full flex justify-center items-center ${styleService.getTWTextColor()} font-bold text-xl`}>
                        wallet
                    </h1>
                </div>

                <ToggleGroup.Root
                    type='single'
                    value={pageManger.getSelectedPage()}
                    onValueChange={(v) => {
                        if (v) pageManger.setSelectedPage(v);
                    }}
                    className='w-full h-full py-[0.2rem] flex justify-start items-center'
                
                >
                    {getPages()}
                </ToggleGroup.Root>

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
  