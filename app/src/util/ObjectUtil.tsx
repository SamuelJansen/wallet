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

export const ObjectUtil = {
    iterateOver,
    generateUniqueKey,
    toJson,
    toObject
}