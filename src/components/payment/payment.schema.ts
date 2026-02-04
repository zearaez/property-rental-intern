export const paymentSchema = {
    createStripeIntent: {
        booking_id: 'string',
        amount: 'number',
    },
    confirmStripePayment: {
        payment_intent_id: 'string',
        booking_id: 'string',
    },
    initiatKhaltiPayment: {
        booking_id: 'string',
        amount: 'number',
    },
    verifyKhaltiPayment: {
        booking_id: 'string',
        transaction_id: 'string',
    },
}
