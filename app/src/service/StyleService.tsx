import { ContexState, State } from "../context-manager/ContextState";
import { StorageUtil } from '../util/storage/StorageUtil';
import { STORAGE_KEYS } from '../util/storage/SotrageKeys';

export interface StyleStateProps extends State {

}

const DARK_MODE = `dark`
const LIGHT_MODE = `light`

export const TOPBAR_DIMMENTONS = 40
export const BORDER_WIDTH = 2
export const TOPBAR_TAILWIND_DIMMENTONS = `w-full h-10` //-> `w-full h-${parseInt(`${TOPBAR_DIMMENTONS/4}`, 10)}`
export const TOPBAR_BACKGROUND_COLOR = 'bg-black'
export const ICON_SIZE = TOPBAR_DIMMENTONS - TOPBAR_DIMMENTONS/8

export class StyleService extends ContexState<StyleStateProps> {

    constructor() {
        super()
        this.state = {
            default: {
                width: `100%`,
                height: `100%`,
                display: `flex`
            },
            colorMode: StorageUtil.get(STORAGE_KEYS.COLOR_MODE, DARK_MODE),
            darkColorMode: {
                button: {
                    main: `#EAB308`,
                    basic: `#AAAAAA`,
                    cancel: `#AAAAAA`,
                    irrevesable: `#e65b65`,
                    confirm: `#08a90c`
                },
                component: {
                    headLine: `#FACC14`,
                    contrast: `#000000`,
                    base: `#EAB308`
                },
                text: `#FACC14`
            },
            lightColorMode: {
                button: {
                    main: `#EAB308`,
                    basic: `#555555`,
                    cancel: `#555555`,
                    irrevesable: `#e65b65`,
                    confirm: `#08a90c`
                },
                component: {
                    headLine: `#CCCCCC`,
                    contrast: `#000000`,
                    base: `#EFF1EE`
                },
                text: `#000000`
            }
        }
    }

    getFooterButtonContent = () => {
        return `mt-2 flex justify-center gap-x-6`
    }

    getIconSize = () => {
        return ICON_SIZE
    }

    getTWCancelButton = () => {
        return `bg-zinc-500 px-5 h-12 rounded-md font-semibold hover:bg-zinc-600`
    }

    getTWMainButton = () => {
        return `${this.getTWButtonColor()} ${this.getTWButtonTextColor()} px-5 py-2 rounded-md font-semibold flex items-center gap-3 hover:bg-yellow-400`
    }

    getMainButtonColor = () => {
        return `${this.getColorMode().button.main}`
    }

    getBasicButtonColor = () => {
        return `${this.getColorMode().button.basic}`
    }

    getCancelButtonColor = () => {
        return `${this.getColorMode().button.cancel}`
    }

    getConfirmButtonColor = () => {
        return `${this.getColorMode().button.confirm}`
    }

    getIrreversableButtonColor = () => {
        return `${this.getColorMode().button.irrevesable}`
    }

    getBorderColor = (): string => {
        return `${this.getColorMode().component.base}`
    }
    
    getTWTextBold = (): string => {
        return `font-bold`
    }

    getTWTextColor = (): string => {
        return `text-yellow-400`
    }

    getTWCardTextColor = (): string => {
        return `text-black`
    }

    getTWButtonTextColor = (): string => {
        return `text-black`
    }

    getTWCardTextTitle = (): string => {
        return `${this.getTWTextBold()} ${this.getTWCardTextColor()}`
    }
    
    getTWButtonColor = (): string => {
        return `bg-yellow-500`
    }
    
    getTWButtonHoverColor = (): string => {
        return `bg-yellow-300`
    }
    
    getTWCardColor = (): string => {
        return `bg-yellow-500`
    }

    getTWCardRounded = (): string => {
        return `rounded-xl`
    }

    getTWBackgroundColor = (): string => {
        return 'bg-black'
    }

    getTWBorder = (): string => {
        return `border-solid rounded-xl border-2 ${this.getTWBorderColor()}`
    }

    getTWBorderColor = (): string => {
        return `border-yellow-500`
    }

    setColorMode = (nextMode: string) => {
        StorageUtil.set(STORAGE_KEYS.COLOR_MODE, nextMode)
        this.setState({...this.state, ...{colorMode: nextMode}})
    }

    getColorMode = () => {
        const currentColorMode = this.isDarkMode() ? {...this.state.darkColorMode} : {...this.state.lightColorMode}
        return currentColorMode
    }

    reloadColorMode = () => {
        const nextColorMode = StorageUtil.get(STORAGE_KEYS.COLOR_MODE, DARK_MODE)
        this.setColorMode(nextColorMode)
        return nextColorMode
    }

    isDarkMode = () => {
        return DARK_MODE === this.state.colorMode
    }

    switchMode = () => {
        const nextColorMode = this.isDarkMode() ? LIGHT_MODE : DARK_MODE
        this.setColorMode(nextColorMode)
    }

    build = (style: any, props={default:true}) => {
        return {
            ...!!style ? {
                ...(props.default ? this.state.default : {}), 
                ...style
            } : {
                ...(props.default ? this.state.default : {})
            }
        }
    }
    
}

export function StyleServiceProvider(): StyleService {
    return new StyleService()
}