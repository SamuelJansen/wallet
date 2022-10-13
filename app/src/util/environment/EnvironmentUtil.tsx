import { ENVIRONEMNT_KEYS, ENVIRONEMNTS } from "./EnvironmentKeys"
import { StringUtil } from '../StringUtil'


const getEnv = () => {
    return import.meta.env
}

const get = (key: string) => {
    return StringUtil.strip(getEnv()[key])
}

const getCurrentEnvironment = () => {
    return get(ENVIRONEMNT_KEYS.ENV)
}

const isLocal = () => {
    return ENVIRONEMNTS.LOCAL === getCurrentEnvironment()
}

const isLocalToDevelopment = () => {
    return ENVIRONEMNTS.LOCAL_TO_DEV === getCurrentEnvironment()
}

const isDevelopment = () => {
    return ENVIRONEMNTS.DEVELOPMENT === getCurrentEnvironment()
}

export const EnvironmentUtil = {
    getEnv, 
    get,
    isLocal,
    isLocalToDevelopment,
    isDevelopment,
    getCurrentEnvironment
}