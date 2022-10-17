import { useState } from 'react';

class ContexState {

    stateUpdateHandler: any
    state: any
    
    constructor() {
        this.stateUpdateHandler = null
        this.state = {}
    }

    propagateState = () => {
        this.stateUpdateHandler({...this})
    }

    setState = (props: any) => {
        if (!!props) {
            Object.keys(props).forEach((key, index) => {
                if (!!props[key]) {
                    if (this.state[key] !== props[key]) {
                        this.state[key] = props[key]
                    }
                } else {
                    this.state[key] = null
                }
            })
        }
        this.propagateState()
    }

    getState = () => {
        return this.state
    }

    overrideUpdateHandler = (stateUpdateHandler: any) => {
        this.stateUpdateHandler = stateUpdateHandler
    }
}

const useContextState = (provider: any) => {
    const [provided, setProvided] = useState(provider)
    provided.overrideUpdateHandler(setProvided)
    return [
        provided
    ]
}

// const useContextState = (provider: any): ContexState[] => {
//     const [provided, setProvided] = useState<ContexState>(provider)
//     provided.overrideUpdateHandler(setProvided)
//     return [
//         provided
//     ]
// }

export {
    ContexState,
    useContextState
}