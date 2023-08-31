import { DateTimeUtil } from "./DateTimeUtil";


const keys = (props: any): string[] => {
    return Object.keys(props)
}

const values = (props: any): string[] => {
    return keys(props).map(key => props[key])
}

const generateUniqueKey = (): string => {
    const timestamp = DateTimeUtil.dateTimeNow();
    const randomNumber = Math.random();
    const hexadecimalString = randomNumber.toString(16);

    return `id-${timestamp}-${hexadecimalString}`;
}

const toJson = (data: any | null) => {
    return JSON.stringify(data)
}

const toObject = (json: string | null) => {
    if (!!json) {
        return JSON.parse(json)
    }
    return null
}

const iterateOver = (props: any): string[] => {
    return keys(props)
}

function indexOfIt<X>(key: X, collection: X[]): number {
    return collection.indexOf(key)
}

function containsIt<X>(key: X, collection: X[]): boolean {
    return 0 <= indexOfIt(key, collection)
}

function inIt<X>(key: X, collection: X[]): boolean {
    return containsIt<X>(key, collection)
}

function notInIt<X>(key: X, collection: X[]): boolean {
    return !inIt<X>(key, collection)
}

function pushIt<X>(key: X, collection: X[]): void {
    collection.push(key)
}

function pushItIfNotIn<X>(key: X, collection: X[]): void {
    const keyIndex = indexOfIt(key, collection)
    if (notInIt(key, collection)) {
        pushIt(key, collection)
    }
}

function popIt<X>(key: X, collection: X[]): void {
    collection.splice(indexOfIt(key, collection), 1)
}

function popItIfInIt<X>(key: X, collection: X[]): void {
    if (inIt(key, collection)) {
        popIt(key, collection)
    }
}

function isNull(instance: any | null): instance is null {
    return !!!instance
}

function isNotNull(instance: any | null): boolean {
    return !isNull(instance)
}

function isEmpty(instance: any | null): boolean {
    return instance instanceof Array ? 0 === instance.length : isNull(instance)
}

function isNotEmpty(instance: any | null): boolean {
    return !isEmpty(instance)
}

function equals(expected: any | null, toAssert: any | null): boolean {
    return expected === toAssert
}

function notEquals(expected: any | null, toAssert: any | null): boolean {
    return !equals(expected, toAssert)
}



export const ObjectUtil = {
    keys,
    values,
    iterateOver,
    generateUniqueKey,
    toJson,
    toObject,
    indexOfIt,
    containsIt,
    inIt,
    notInIt,
    popIt,
    popItIfInIt,
    pushIt,
    pushItIfNotIn,
    isNull,
    isNotNull,
    isEmpty,
    isNotEmpty,
    equals,
    notEquals
}