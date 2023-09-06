import { FormEvent } from "react"


function getData(event: FormEvent<Element> | undefined) {
    if (event) {
        event.preventDefault()
        const formData = new FormData(event.target as HTMLFormElement)
        return Object.fromEntries(formData)
    } else {
        return {}
    }
}

export function componentExecutor<T>(props: { 
    requestConstructor: CallableFunction, 
    validator: CallableFunction, 
    requestProcessor: CallableFunction, 
    postRequestProcessor: CallableFunction 
}) {
    const handler = async (formEvent?: FormEvent, handlerProps: { debugIt: boolean } = { debugIt: false }) => {
        const {
            requestConstructor, 
            validator, 
            requestProcessor, 
            postRequestProcessor
        } = {...props}
        if (handlerProps.debugIt) {
            console.log(formEvent)
        }
        const requestBody: T = requestConstructor(getData(formEvent))
        if (handlerProps.debugIt) {
            console.log(requestBody)
        }
        try{
            validator(requestBody)
            requestProcessor(requestBody)
            postRequestProcessor()
        } catch (err: any) {
            console.log(err)
            alert(`api client error: ${err.message}`)
        }
    }
    return handler
}
