export const bookingSchema = {
    createBooking: {
        property_id: 'string',
        start_date: 'string',
        end_date: 'string',
    },
    updateBooking: {
        start_date: 'string',
        end_date: 'string',
    },
}
