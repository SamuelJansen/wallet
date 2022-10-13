const strip = (str:string) => {
    return str.replace(/^\s+|\s+$/g, '');
}

export const StringUtil = {
    strip
}