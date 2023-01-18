import { useState } from 'react';


export interface ServiceState {

}

export interface ManagerState {

}

export class ContexState<T extends ServiceState | ManagerState> {

    stateUpdateHandler: any
    state: T | any
    
    constructor() {
        this.stateUpdateHandler = null
        this.state = {} as T
    }

    propagateState = () => {
        this.stateUpdateHandler({...this})
    }

    setStateWithoutPropagation = (props: T | any) => {
        if (!!props) {
            Object.keys(props).forEach((key: string, index) => {
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

export const useContextState = (provider: any) => {
    const [provided, setProvided] = useState(provider)
    provided.overrideUpdateHandler(setProvided)
    return [
        provided
    ]
}


export interface DataStateProps {
    data: object,
    isLoaded: boolean
}
