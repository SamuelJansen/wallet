const set = (key: string, data: any) => {
    localStorage.removeItem(key);
    localStorage.setItem(key, JSON.stringify(data));
} 

const get = (key: string, orDefault: any) => {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : !!orDefault ? orDefault : null
}

export const StorageUtil = {
    set,
    get
}