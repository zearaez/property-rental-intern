import { addSeconds, addMinutes, addHours, addDays, addYears } from 'date-fns'

export const addDaysToString = (days: string): Date => {
    const currentValue = parseInt(days.slice(0, -1))
    const currentType = days.slice(-1)

    switch (currentType) {
        case 's': {
            return addSeconds(new Date(), currentValue)
        }
        case 'm': {
            return addMinutes(new Date(), currentValue)
        }
        case 'h': {
            return addHours(new Date(), currentValue)
        }
        case 'd': {
            return addDays(new Date(), currentValue)
        }
        case 'y': {
            return addYears(new Date(), currentValue)
        }
        default: {
            return undefined
        }
    }
}
