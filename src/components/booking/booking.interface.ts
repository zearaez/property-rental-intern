export interface ICreateBooking {
    property_id: string
    start_date: string // ISO 8601 format
    end_date: string   // ISO 8601 format
}

export interface IUpdateBooking {
    start_date?: string
    end_date?: string
}
