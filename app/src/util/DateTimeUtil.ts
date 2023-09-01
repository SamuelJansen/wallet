import { StringUtil } from "./StringUtil";

const ofDate = (givenDate: String | Date | null): Date => {
    if (givenDate instanceof String || typeof givenDate === 'string') {
        const formattedDateParts = givenDate.split('-');
        const year = parseInt(formattedDateParts[0]);
        const month = parseInt(formattedDateParts[1]) - 1; // Month is zero-based in JavaScript Date
        const day = parseInt(formattedDateParts[2]);
        return new Date(year, month, day);
    }
    if (givenDate instanceof Date) {
        return ofDate(toRestDate(givenDate))
    }
    return dateNow()
}

const concatRestDateTime = (props: {
    restDate?: string
    restTime?: string
    yearDashMOnthDashDay?: string
    hourDashMinute?: string
}): string => {
    if (StringUtil.isNotEmpty(props.restDate) && StringUtil.isNotEmpty(props.restTime)) {
        return `${props.restDate} ${props.restTime}`
    }
    if (StringUtil.isNotEmpty(props.yearDashMOnthDashDay) && StringUtil.isNotEmpty(props.hourDashMinute)) {
        return `${props.yearDashMOnthDashDay} ${props.hourDashMinute}:00.000`
    }
    if (StringUtil.isNotEmpty(props.yearDashMOnthDashDay) && StringUtil.isNotEmpty(props.restTime)) {
        return `${props.yearDashMOnthDashDay} ${props.restTime}`
    }
    if (StringUtil.isNotEmpty(props.restDate) && StringUtil.isNotEmpty(props.hourDashMinute)) {
        return `${props.restDate} ${props.hourDashMinute}:00.000`
    }
    return `${getTodayRestDate()} ${getTodayRestTime()}`
}

const now = (): Date => {
    return new Date()
}

const dateNow = (): Date => {
    return now()
}

const dateTimeNow = (): Date => {
    return now()
}

const isLeapYear = (date: Date): boolean => { 
    const year = date.getFullYear()
    return (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0)); 
}

const getTotalDays = function (date: Date): number {
    const month = date.getMonth()
    return [31, (isLeapYear(date) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
}

const addMonths = (date: Date, months: number): Date => {
    var currentDate = date.getDate();
    date.setDate(1);
    date.setMonth(date.getMonth() + months);
    date.setDate(Math.min(currentDate, getTotalDays(date)));
    return date;
}

const fromHoursColonMinutesToMinutes = (hoursColonMinutesAsString: string): number => {
    const [hour, minute] = hoursColonMinutesAsString.split(':').map(Number)
    return hour * 60 + minute
}

const fromMinutesToHoursColonMinutes = (minutes: number): string => {
    return `${new String(Math.floor(minutes / 60)).padStart(2, '0')}:${new String((minutes % 60)).padStart(2, '0')}`
}

const fromRestDateToMonthSlashYear = (date: string): string => {
    const splitedDate = new String(date).split('-')
    return `${splitedDate[1]}/${splitedDate[0]}`
} 

const getTodayRestDate = (): string => {
    return new String(dateNow().toUTCString().slice(0, 10)) as string
}

const getTodayRestTime = (): string => {
    return new String(dateNow().toUTCString().slice(11, 23)) as string
}

const getTodayUserDate = (): string => {
    return new String(dateNow().toLocaleDateString()) as string
}

const toUserDate = (date: String | Date): string => {
    if (date instanceof String || typeof date === 'string') {
        const dateSpitted = date.split(' ')[0].split('-')
        return `${dateSpitted[2]}/${dateSpitted[1]}/${dateSpitted[0]}`
    }
    return `${new String(date.getDate()).padStart(2, '0')}/${new String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`
}

const toUserTime = (date: String | Date): string => {
    if (date instanceof String || typeof date === 'string') {
        const dateSpitted = date.split(' ')[1].split(':')
        return `${dateSpitted[0]}:${dateSpitted[1]}:${dateSpitted[2]}`
    }
    return `${new String(date.getHours()).padStart(2, '0')}:${new String(date.getMinutes()).padStart(2, '0')}:${new String(date.getSeconds()).padStart(2, '0')}.${new String(date.getMilliseconds()).padStart(3, '0')}`
}

const toUserDateTime = (date: String | Date): string => {
    return `${toUserDate(date)} ${toUserTime(date)}`
}

const toRestDate = (date: String | Date): string => {
    if (date instanceof String || typeof date === 'string') {
        const dateSpitted = date.split(' ')[0].split('/')
        return `${dateSpitted[0]}-${dateSpitted[1]}-${dateSpitted[2]}`
    }
    return `${date.getFullYear()}-${new String(date.getMonth() + 1).padStart(2, '0')}-${new String(date.getDate()).padStart(2, '0')}`
}

export const DateTimeUtil = {
    ofDate,
    concatRestDateTime,
    dateNow,
    dateTimeNow,
    isLeapYear,
    getTotalDays,
    addMonths,
    fromHoursColonMinutesToMinutes,
    fromMinutesToHoursColonMinutes,
    fromRestDateToMonthSlashYear,
    getTodayRestDate,
    getTodayRestTime,
    getTodayUserDate,
    toUserDate,
    toUserTime,
    toUserDateTime,
    toRestDate
}