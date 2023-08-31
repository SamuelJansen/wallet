import { ObjectUtil } from "./ObjectUtil";

const stripIt = (str:String): string | null => {
    return str.replace(/^\s+|\s+$/g, '');
}

const containsIt = (str: String, char: string): boolean => {
    return str.includes(char);
}

const isEmpty = (thing: any): boolean => {
    if (thing instanceof String) {
        return ! ObjectUtil.equals(stripIt(thing), '') 
    }
    return ObjectUtil.isEmpty(thing)
}

const isNotEmpty = (thing: any): boolean => {
    return !isEmpty(thing)
}

const concatIt = (stringList: string[], concatChar: string) => {
    let concated: string = ''
    stringList.forEach(char => {
        if (isNotEmpty(char)) {
            concated = concated.concat(char)
            concated = concated.concat(concatChar)
        }
    })
    return concated.slice(0, concated.length - concatChar.length)
}

export const StringUtil = {
    stripIt,
    concatIt,
    containsIt,
    isEmpty,
    isNotEmpty
}