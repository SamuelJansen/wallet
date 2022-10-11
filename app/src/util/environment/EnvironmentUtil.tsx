import { ENVIRONEMNT_KEYS, ENVIRONEMNTS } from "./EnvironmentKeys"


const getEnv = () => {
    return import.meta.env
}

const get = (key: string) => {
    return getEnv()[key]
}

const getCurrentEnvironment = () => {
    return get(ENVIRONEMNT_KEYS.ENV)
}

const isLocal = () => {
    return ENVIRONEMNTS.LOCAL === getCurrentEnvironment()
}

const isDevelopment = () => {
    return ENVIRONEMNTS.DEVELOPMENT === getCurrentEnvironment()
}

export const EnvironmentUtil = {
    getEnv, 
    get,
    isLocal,
    isDevelopment,
    getCurrentEnvironment
}