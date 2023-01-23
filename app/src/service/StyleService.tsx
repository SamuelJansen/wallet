import { ContexState, ServiceState } from "../context-manager/ContextState";
import { StorageUtil } from '../util/storage/StorageUtil';
import { STORAGE_KEYS } from '../util/storage/SotrageKeys';

export interface StyleStateProps extends ServiceState {

}

const DARK_MODE = `dark`
const LIGHT_MODE = `light`

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
                component: {
                    headLine: `#FACC14`,
                    contrast: `#000000`,
                    base: `#EAB308`
                },
                text: `#FACC14`
            },
            lightColorMode: {
                component: {
                    headLine: `#CCCCCC`,
                    contrast: `#000000`,
                    base: `#EFF1EE`
                },
                text: `#000000`
            }
        }
    }

    getBorderColor = () => {
        return `${this.getColorMode().component.base}`
    }
    
    getTWTextBold = () => {
        return `font-bold`
    }

    getTWTextColor = () => {
        return `text-yellow-400`
    }

    getTWCardTextColor = () => {
        return `text-black`
    }

    getTWCardTextTitle = () => {
        return `${this.getTWTextBold()} ${this.getTWCardTextColor()}`
    }
    
    getTWCardColor = () => {
        return `bg-yellow-500`
    }

    getTWCardRounded = () => {
        return `rounded-xl`
    }

    getTWBackgroundColor = () => {
        return 'bg-black'
    }

    getTWBorder = () => {
        return `border-solid rounded-xl border-2 ${this.getTWBorderColor()}`
    }

    getTWBorderColor = () => {
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