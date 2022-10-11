import { CSSProperties } from "react";


const TOBBAR_DIMMENTONS = 'w-full h-8' 
const TOBBAR_BACKGROUND_COLOR = 'bg-black'


export const TopbarComponent = () => {
    return (
        <div className='w-full h-8 flex flex-col'>

            <div className={`fixed ${TOBBAR_DIMMENTONS} px-4 flex justify-content-between items-center ${TOBBAR_BACKGROUND_COLOR}`}>

                <div className='w-[185px] h-full flex justify-content-left items-center'>
                    <h1 className='w-full h-full flex justify-content-center items-center text-yellow-400'>
                        Wallet
                    </h1>
                </div>

                <div className='w-full h-full flex justify-content-right items-center'>
                    <div className='w-full h-full'></div>
                    <h1 className='pl-4 text-right text-yellow-400'>
                        icon
                    </h1>
                    <h1 className='pl-4 text-right text-yellow-400'>
                        icon
                    </h1>
                    <h1 className='pl-4 text-right text-yellow-400'>
                        icon
                    </h1>
                </div>

            </div>

            <div className={`${TOBBAR_DIMMENTONS} ${TOBBAR_BACKGROUND_COLOR}`}>
                {/*under topbar filler*/}
            </div>
            
        </div>
    );
};
  