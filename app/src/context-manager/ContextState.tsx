import { Dispatch, DispatchWithoutAction, SetStateAction, useState } from 'react';
import { ObjectUtil } from '../util/ObjectUtil';


export interface ContextProvider<T> extends CallableFunction {
    (): T | (() => T)
}

export interface State {
    [key: string]: any
}

export interface StateExtender extends State {
}

export interface BinaryStateHandler {    
    it: boolean
    setIt: Dispatch<SetStateAction<boolean>>
    isIt: CallableFunction
    isNotIt: CallableFunction
    switchIt: DispatchWithoutAction
}

export class ContexState<T extends State | StateExtender> {

    stateUpdateHandler: any
    state: T
    
    constructor() {
        this.stateUpdateHandler = null
        this.state = {} as T
    }

    buildState = (outterState: State) => {
        this.setState(outterState)
        // this.state = {
        //     ...this.state,
        //     ...outterState
        // } as T
    }


    propagateState = () => {
        this.stateUpdateHandler({...this})
    }

    setStateWithoutPropagation = (props: State) => {
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



export function useContextState<T extends ContexState<State>>(provider: any): T {
    const [provided, setProvided] = useState<T>(provider as (() => T))
    provided.overrideUpdateHandler(setProvided)
    return provided
}

export const useBinaryStateHandler = (initialState: boolean = false): BinaryStateHandler => {    
    const [it, setIt] = useState<boolean>(initialState)
    const isIt = (): boolean => {
        return true && it
    }
    const switchIt = (): boolean => {
        setIt(!isIt())
        return isIt()
    }
    const isNotIt = () => {
        return !isIt()
    }
    return {
        it: it,
        setIt: setIt,
        isIt: isIt,
        isNotIt: isNotIt,
        switchIt: switchIt
    }
}

