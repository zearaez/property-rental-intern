import {
    createStripeIntentHandler,
    confirmStripePaymentHandler,
    initiateKhaltiPaymentHandler,
    verifyKhaltiPaymentHandler,
    getPaymentHandler,
    getPaymentByBookingHandler,
} from './payment.controller'
import {
    paymentValidator,
    createStripeIntentSchema,
    confirmStripePaymentSchema,
    initiateKhaltiPaymentSchema,
    verifyKhaltiPaymentSchema,
} from './payment.validator'
import { authGuard } from '@/middlewares/auth.middleware'
import { Router } from 'express'

const paymentRouter = Router()

paymentRouter
    .post(
        '/payments/stripe/create-intent',
        authGuard,
        paymentValidator(createStripeIntentSchema),
        createStripeIntentHandler
    )
    .post(
        '/payments/stripe/confirm',
        authGuard,
        paymentValidator(confirmStripePaymentSchema),
        confirmStripePaymentHandler
    )
    .post(
        '/payments/khalti/initiate',
        authGuard,
        paymentValidator(initiateKhaltiPaymentSchema),
        initiateKhaltiPaymentHandler
    )
    .post(
        '/payments/khalti/verify',
        authGuard,
        paymentValidator(verifyKhaltiPaymentSchema),
        verifyKhaltiPaymentHandler
    )
    .get('/payments/:id', authGuard, getPaymentHandler)
    .get('/bookings/:bookingId/payment', authGuard, getPaymentByBookingHandler)

export default paymentRouter
