const fromHoursColonMinutesToMinutes = (hoursColonMinutesAsString: string) => {
    const [hour, minute] = hoursColonMinutesAsString.split(':').map(Number)
    return hour * 60 + minute
}

const fromMinutesToHoursColonMinutes = (minutes: number) => {
    return `${new String(Math.floor(minutes / 60)).padStart(2, '0')}:${new String((minutes % 60)).padStart(2, '0')}`
}

const now = () => {
    return new Date()
}


const fromRestDateToMonthSlashYear = (date: string) => {
    const splitedDate = new String(date).split('-')
    return `${splitedDate[1]}/${splitedDate[0]}`
} 

const getTodayRestDate = () => {
    return new String(now().toISOString().slice(0, 10))
}

const getTodayUserDate = () => {
    return new String(now().toLocaleDateString())
}

const toUserDate = (date: String | Date) => {
    if (date instanceof String || typeof date === 'string') {
        const dateSpitted = date.split(' ')[0].split('-')
        return `${dateSpitted[2]}/${dateSpitted[1]}/${dateSpitted[0]}`
    }
    return `${new String(date.getDate()).padStart(2, '0')}/${new String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`
}

const toRestDate = (date: String | Date) => {
    if (date instanceof String || typeof date === 'string') {
        const dateSpitted = date.split(' ')[0].split('/')
        return `${dateSpitted[0]}-${dateSpitted[1]}-${dateSpitted[2]}`
    }
    return `${date.getFullYear()}-${new String(date.getMonth() + 1).padStart(2, '0')}-${new String(date.getDate()).padStart(2, '0')}`
}




export const DateTimeUtil = {
    fromHoursColonMinutesToMinutes,
    fromMinutesToHoursColonMinutes,
    fromRestDateToMonthSlashYear,
    getTodayRestDate,
    getTodayUserDate,
    toUserDate,
    toRestDate,
    now
}