import { useState } from 'react';
import { ObjectUtil } from '../util/ObjectUtil';


export interface ContextProvider<T> extends CallableFunction {
    (): T | (() => T)
}

export interface ServiceState {
    [key: string]: any
}

export interface ManagerState {
    [key: string]: any
}

export class ContexState<T extends ServiceState | ManagerState> {

    stateUpdateHandler: any
    state: T
    
    constructor() {
        this.stateUpdateHandler = null
        this.state = {} as T
    }

    propagateState = () => {
        this.stateUpdateHandler({...this})
    }

    setStateWithoutPropagation = (props: ServiceState | ManagerState) => {
        if (!!props) {
            ObjectUtil.iterateOver(props).forEach((key: string, index: number) => {
                if (!!props[key]) {
                    if (this.state[key] !== props[key]) {
                        this.state[key] = props[key]
                    }
                } else {
                    this.state[key] = null
                }
            })
        }
    }

    setState = (props: T | any) => {
        this.setStateWithoutPropagation(props)
        this.propagateState()
        return this.getState()
    }

    getState = () => {
        return this.state
    }

    overrideUpdateHandler = (stateUpdateHandler: any) => {
        this.stateUpdateHandler = stateUpdateHandler
    }
}

// export const useContextState = (provider: any) => {
//     const [provided, setProvided] = useState(provider)
//     provided.overrideUpdateHandler(setProvided)
//     return [
//         provided
//     ]
// }



export function useContextState<T extends ContexState<ServiceState | ManagerState>>(provider: any): T {
    const [provided, setProvided] = useState<T>(provider as (() => T))
    provided.overrideUpdateHandler(setProvided)
    return provided
}

