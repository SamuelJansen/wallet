import { ObjectUtil } from "../ObjectUtil";


const set = (key: string, data: any) => {
    localStorage.removeItem(key);
    localStorage.setItem(key, ObjectUtil.toJson(data));
} 

const get = (key: string, orDefault: any = null) => {
    const data = localStorage.getItem(key)
    return data ? ObjectUtil.toObject(data) : !!orDefault ? orDefault : null
}

export const StorageUtil = {
    set,
    get
}