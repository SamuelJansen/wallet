const generateUniqueKey = () => {
    const timestamp = Date.now();
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

const iterateOver = (props: any) => {
    return Object.keys(props)
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

function pushItIfNotIn<X>(key: X, collection: X[]): void {
    const keyIndex = indexOfIt(key, collection)
    if (notInIt(key, collection)) {
        pushIt(key, collection)
    }
}

function pushIt<X>(key: X, collection: X[]): void {
    collection.push(key)
}

function popIt<X>(key: X, collection: X[]): void {
    const keyIndex = indexOfIt(key, collection)
    collection.splice(keyIndex, 1)
}

export const ObjectUtil = {
    iterateOver,
    generateUniqueKey,
    toJson,
    toObject,
    indexOfIt,
    containsIt,
    inIt,
    notInIt,
    popIt,
    pushIt,
    pushItIfNotIn
}