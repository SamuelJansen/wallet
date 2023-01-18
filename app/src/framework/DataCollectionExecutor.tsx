import { ContexState, ServiceState } from "../context-manager/ContextState"
import { AuthenticationService } from "../service/AuthenticationService"
import { ObjectUtil } from "../util/ObjectUtil"
import { DataApi, ErrorApi, RESOURCE_OPERATIONS, RestResponse } from "./DataApi"

export const REST_METHODS = {
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    PATCH: 'PATCH',
    DELETE: 'DELETE',
    HEAD: 'HEAD',
    OPTIONS: 'OPTIONS'
}

export interface DataCollectionProps<T extends ServiceState> {
    url: string, 
    stateName: string, 
    authenticationService: AuthenticationService
    service: ContexState<T>
}

export interface MessageDetails {
    key: string
    message: string
}

export interface ResourceState<T extends DataApi> {
    data: Map<string, T>,
    isProcessing: false,
    isProcessed: false
}

const informError = (props: {message: string | null, details: MessageDetails[]}) => {
    alert(props.message)
    console.log(props.message)
    console.log(props.details)
}

const COLLECTION_STATE_KEY = 'COLLECTION'

export class DataCollectionExecutor<T extends ServiceState, X extends DataApi, Y extends DataApi> {
    url: string
    stateName: string
    authenticationService: AuthenticationService
    service: ContexState<T>
    constructor(props: DataCollectionProps<T>) {
        this.url = props.url
        this.stateName = props.stateName
        this.authenticationService = props.authenticationService
        this.service = props.service
        this.service.setStateWithoutPropagation({
            [this.stateName]: {
                [COLLECTION_STATE_KEY]: {
                    data: {},
                    isProcessing: false,
                    isProcessed: false
                } as ResourceState<X>,
                // [RESOURCE_OPERATIONS.GET_COLLECTION]: {
                //     data: {},
                //     isProcessing: false,
                //     isProcessed: false
                // } as ResourceState<X>,
                // [RESOURCE_OPERATIONS.POST_COLLECTION]: {
                //     data: {},
                //     isProcessing: false,
                //     isProcessed: false
                // } as ResourceState<X>,
                // [RESOURCE_OPERATIONS.PATCH_COLLECTION]: {
                //     data: {},
                //     isProcessing: false,
                //     isProcessed: false
                // } as ResourceState<X>
            }
        })
    }

    //collection
    dataCollectionIsLoaded = (hashable: any): boolean => {
        return this.service.getState()[this.stateName][COLLECTION_STATE_KEY].isProcessed
    }

    dataCollectionIsNotLoaded = (hashable: any): boolean => {
        return !this.dataCollectionIsLoaded(hashable)
    }

    dataCollectionIsLoading = (hashable: any): boolean => {
        return this.service.getState()[this.stateName][COLLECTION_STATE_KEY].isProcessing
    }

    dataCollectionIsNotLoading = (hashable: any): boolean => {
        return !this.dataCollectionIsLoading(hashable)
    }

    //get
    dataCollectionIsFound = (hashable: any): boolean => {
        return this.service.getState()[this.stateName][COLLECTION_STATE_KEY].isProcessed
        // return this.service.getState()[this.stateName][RESOURCE_OPERATIONS.GET_COLLECTION].isProcessed
    }

    dataCollectionIsNotFound = (hashable: any): boolean => {
        return !this.dataCollectionIsFound(hashable)
    }

    dataCollectionIsFinding = (hashable: any): boolean => {
        return this.service.getState()[this.stateName][COLLECTION_STATE_KEY].isProcessing
        // return this.service.getState()[this.stateName][RESOURCE_OPERATIONS.GET_COLLECTION].isProcessing
    }

    dataCollectionIsNotFinding = (hashable: any): boolean => {
        return !this.dataCollectionIsFinding(hashable)
    }

    //post
    dataCollectionIsCreated = (hashable: any): boolean => {
        return this.service.getState()[this.stateName][COLLECTION_STATE_KEY].isProcessed
        // return this.service.getState()[this.stateName][RESOURCE_OPERATIONS.POST_COLLECTION].isProcessed
    }

    dataCollectionIsNotCreated = (hashable: any): boolean => {
        return !this.dataCollectionIsCreated(hashable)
    }

    dataCollectionIsCreating = (hashable: any): boolean => {
        return this.service.getState()[this.stateName][COLLECTION_STATE_KEY].isProcessing
        // return this.service.getState()[this.stateName][RESOURCE_OPERATIONS.POST_COLLECTION].isProcessing
    }

    dataCollectionIsNotCreating = (hashable: any): boolean => {
        return !this.dataCollectionIsCreating(hashable)
    }

    //path
    dataCollectionIsPatched = (hashable: any): boolean => {
        return this.service.getState()[this.stateName][COLLECTION_STATE_KEY].isProcessed
        // return this.service.getState()[this.stateName][RESOURCE_OPERATIONS.PATCH_COLLECTION].isProcessed
    }

    dataCollectionIsNotPatched = (hashable: any): boolean => {
        return !this.dataCollectionIsPatched(hashable)
    }

    dataCollectionIsPatching = (hashable: any): boolean => {
        return this.service.getState()[this.stateName][COLLECTION_STATE_KEY].isProcessing
        // return this.service.getState()[this.stateName][RESOURCE_OPERATIONS.PATCH_COLLECTION].isProcessing
    }

    dataCollectionIsNotPatching = (hashable: any): boolean => {
        return !this.dataCollectionIsPatching(hashable)
    }

    getDataCollection = (props?: {query?: {}}, callback?: CallableFunction): X[] => {
        if (this.dataCollectionIsLoading(props)) {
            return this._accessCurrentDataCollection()
        }
        this._setProcessingState(RESOURCE_OPERATIONS.GET_COLLECTION)
        return this.authenticationService.isAuthorized() ? (() => {
            const url = new URL(this.url)
            url.search = new URLSearchParams(props?.query ? props.query : {}).toString();
            try {
                fetch(url, {
                    method: REST_METHODS.GET,
                    headers: this.authenticationService.getAuthenticatedHeader()
                })
                    .then(async (resp) => {
                            return {
                                body: (await resp.json()) as X[],
                                status: resp.status,
                                originalResponse: resp
                            } as RestResponse<X[]>
                    })
                    .then((restResponse: RestResponse<X[]>) => {
                        if (restResponse.body instanceof Array<X>) {
                            this.overrideDataCollection(restResponse.body, RESOURCE_OPERATIONS.GET_COLLECTION)
                        } 
                        else {
                            this._setNotProcessingState(RESOURCE_OPERATIONS.GET_COLLECTION)
                            informError({
                                message: restResponse?.body?.message,
                                details: []
                            })
                        }
                        return restResponse
                    })
                    .then((restResponse) => {
                        if (callback) callback()
                        return restResponse
                    })
                    .catch((error) => {
                        this._setNotProcessingState(RESOURCE_OPERATIONS.GET_COLLECTION)
                        informError({
                            message: 'Unable to find resources',
                            details: [
                                {
                                    key: error.message,
                                    message: error.message
                                }
                            ]
                        })
                    })
            } catch (error: any) {
                this._setNotProcessingState(RESOURCE_OPERATIONS.GET_COLLECTION)
                console.log(error)
            }
            
            return this._accessCurrentDataCollection() 
        })() : [] 
    }

    
    postDataCollection = (request: Y[], callback?: CallableFunction): X[] => {
        if (this.dataCollectionIsCreating(request)) {
            return []
        }
        this._setProcessingState(RESOURCE_OPERATIONS.POST_COLLECTION)
        return this.authenticationService.isAuthorized() ? (() => {
            const url = new URL(this.url)
            try {
                fetch(url, {
                    method: REST_METHODS.POST,
                    headers: this.authenticationService.getAuthenticatedHeader(),
                    body: ObjectUtil.toJson(request)
                })
                    .then(async (resp) => {
                            return {
                                body: (await resp.json()) as X[],
                                status: resp.status,
                                originalResponse: resp
                            } as RestResponse<X[]>
                    })
                    .then((restResponse: RestResponse<X[]>) => {
                        if (restResponse.body instanceof Array<X>) {
                            this.overrideDataCollection(restResponse.body, RESOURCE_OPERATIONS.POST_COLLECTION)
                        } 
                        else {
                            this._setNotProcessingState(RESOURCE_OPERATIONS.POST_COLLECTION)
                            informError({
                                message: restResponse?.body?.message,
                                details: []
                            })
                        }
                        return restResponse
                    })
                    .then((restResponse) => {
                        if (callback) callback()
                        return restResponse
                    })
                    .catch((error) => {
                        this._setNotProcessingState(RESOURCE_OPERATIONS.POST_COLLECTION)
                        informError({
                            message: 'Unable to post resources',
                            details: [
                                {
                                    key: error.message,
                                    message: error.message
                                }
                            ]
                        })
                    })
            } catch (error: any) {
                this._setNotProcessingState(RESOURCE_OPERATIONS.POST_COLLECTION)
                console.log(error)
            }
            
            return []
        })() : [] 
    }

    
    patchDataCollection = (request: Y[], props?: {query?: {}}, callback?: CallableFunction): X[] => {
        if (this.dataCollectionIsPatching({request, props})) {
            return []
        }
        this._setProcessingState(RESOURCE_OPERATIONS.PATCH_COLLECTION)
        return this.authenticationService.isAuthorized() ? (() => {
            const url = new URL(this.url)
            url.search = new URLSearchParams(props?.query ? props.query : {}).toString();
            try {
                fetch(url, {
                    method: REST_METHODS.PATCH,
                    headers: this.authenticationService.getAuthenticatedHeader(),
                    body: ObjectUtil.toJson(request)
                })
                    .then(async (resp) => {
                            return {
                                body: (await resp.json()) as X[],
                                status: resp.status,
                                originalResponse: resp
                            } as RestResponse<X[]>
                    })
                    .then((restResponse: RestResponse<X[]>) => {
                        if (restResponse.body instanceof Array<X>) {
                            this.overrideDataCollection(restResponse.body, RESOURCE_OPERATIONS.PATCH_COLLECTION)
                        } 
                        else {
                            this._setNotProcessingState(RESOURCE_OPERATIONS.PATCH_COLLECTION)
                            informError({
                                message: restResponse?.body?.message,
                                details: []
                            })
                        }
                        return restResponse
                    })
                    .then((restResponse) => {
                        if (callback) callback()
                        return restResponse
                    })
                    .catch((error) => {
                        this._setNotProcessingState(RESOURCE_OPERATIONS.PATCH_COLLECTION)
                        informError({
                            message: 'Unable to patch resources',
                            details: [
                                {
                                    key: error.message,
                                    message: error.message
                                }
                            ]
                        })
                    })
            } catch (error: any) {
                this._setNotProcessingState(RESOURCE_OPERATIONS.PATCH_COLLECTION)
                console.log(error)
            }
            
            return []
        })() : [] 
    }

    overrideDataCollection = (dataCollection: X[], operation = RESOURCE_OPERATIONS.GET_COLLECTION) => {
        const currentState = this.service.getState()
        dataCollection.forEach((data: X) => {
            if (!!!data.key) {
                data.key = ObjectUtil.generateUniqueKey()
                console.warn(`data should have a non null key. Guiving it a temporary key: ${data.key}`)
                console.warn(data)
            }
            // currentState[this.stateName][operation].data[data.key] = {...data}
            currentState[this.stateName][COLLECTION_STATE_KEY].data[data.key] = {...data}
        });
        // this._updateResourceState(this.service.getState(), operation, {isProcessed: true, isProcessing: false})
        this._setProcessedState(currentState, operation)
        return this._accessStateDataCollectionValues(currentState[this.stateName][COLLECTION_STATE_KEY])
    }

    accessCachedDataCollection = (props?: {query?: {}}, operation = RESOURCE_OPERATIONS.GET_COLLECTION): X[] => {
        return this.authenticationService.isAuthorized() ? (() => {
            // return this._accessCurrentDataCollection(operation)
            return this.dataCollectionIsLoaded(props) ? this._accessCurrentDataCollection(props, operation) : this.getDataCollection(props?.query ? {query: props.query} : {})
        })() : [] 
    }

    _setProcessingState = (operation = RESOURCE_OPERATIONS.GET_COLLECTION) => {
        // this._updateResourceState(this.service.getState(), operation, {isProcessing: true}) 
        this._updateResourceState(this.service.getState(), COLLECTION_STATE_KEY, {isProcessing: true}) 
    }

    _setNotProcessingState = (operation = RESOURCE_OPERATIONS.GET_COLLECTION) => {
        // this._updateResourceState(this.service.getState(), operation, {isProcessing: true}) 
        this._updateResourceState(this.service.getState(), COLLECTION_STATE_KEY, {isProcessing: false}) 
    }

    _setProcessedState = (currentState: T | any, operation = RESOURCE_OPERATIONS.GET_COLLECTION) => {
        // this._updateResourceState(currentState, operation, {isProcessed: true, isProcessing: false}) 
        this._updateResourceState(currentState, COLLECTION_STATE_KEY, {isProcessed: true, isProcessing: false}) 
    }

    _updateResourceState = (currentState: T | any, operation: string, statePatch: object) => {
        // const mergedState = {...this._mergeResourceState(currentState, operation, statePatch)}
        // console.log(operation)
        // console.log(this._mergeResourceState(currentState, COLLECTION_STATE_KEY, statePatch))
        // this.service.setState({[this.stateName]: this._mergeResourceState(currentState, operation, statePatch)})
        return this.service.setState({[this.stateName]: this._mergeResourceState(currentState, COLLECTION_STATE_KEY, statePatch)})
    }

    _mergeResourceState = (currentState: T | any, operation: string, statePatch: object) => {
        return {...currentState[this.stateName], ...{[operation]: {...currentState[this.stateName][operation], ...statePatch}}}
    }

    _accessCurrentDataCollection = (props?: {query?: {}}, operation = RESOURCE_OPERATIONS.GET_COLLECTION): X[] => {
        // return this._accessStateDataCollectionValues(this.service.getState()[this.stateName][operation])
        // if (this.dataCollectionIsNotLoading(props)) {
        //     setTimeout(() => {
        //         this._updateResourceState(this.service.getState(), COLLECTION_STATE_KEY, {})
        //     }, 1000)
        // }
        return this._accessStateDataCollectionValues(this.service.getState()[this.stateName][COLLECTION_STATE_KEY])
    }

    _accessStateDataCollectionValues = (stateData: any): X[] => {
        return Object.values(stateData.data)
    } 
}