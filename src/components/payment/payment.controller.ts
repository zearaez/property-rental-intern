import asyncWrapper from '@/utils/asyncWrapper'
import {
    createStripePaymentIntentService,
    confirmStripePaymentService,
    initiateKhaltiPaymentService,
    verifyKhaltiPaymentService,
    getPaymentService,
    getPaymentsByBookingService,
} from './payment.service'

export const createStripeIntentHandler = asyncWrapper(async (req, res) => {
    /**
     #swagger.tags = ["Payments"]
     #swagger.security = [{ "bearerAuth": [] }]
     #swagger.requestBody = {
        required: true,
        schema: { $ref: "#/components/schemas/createStripeIntent" }
     }
     */
    const result = await createStripePaymentIntentService(req.body.booking_id, req.auth_user)
    return {
        statusCode: 201,
        message: 'Payment intent created successfully',
        data: result,
    }
})

export const confirmStripePaymentHandler = asyncWrapper(async (req, res) => {
    /**
     #swagger.tags = ["Payments"]
     #swagger.security = [{ "bearerAuth": [] }]
     #swagger.requestBody = {
        required: true,
        schema: { $ref: "#/components/schemas/confirmStripePayment" }
     }
     */
    const payment = await confirmStripePaymentService(
        req.body.booking_id,
        req.body.payment_intent_id,
        req.auth_user
    )
    return {
        statusCode: 200,
        message: 'Payment confirmed successfully',
        data: payment,
    }
})

export const initiateKhaltiPaymentHandler = asyncWrapper(async (req, res) => {
    /**
     #swagger.tags = ["Payments"]
     #swagger.security = [{ "bearerAuth": [] }]
     #swagger.requestBody = {
        required: true,
        schema: { $ref: "#/components/schemas/initiateKhaltiPayment" }
     }
     */
    const result = await initiateKhaltiPaymentService(req.body.booking_id, req.auth_user)
    return {
        statusCode: 201,
        message: 'Khalti payment initiated successfully',
        data: result,
    }
})

export const verifyKhaltiPaymentHandler = asyncWrapper(async (req, res) => {
    /**
     #swagger.tags = ["Payments"]
     #swagger.security = [{ "bearerAuth": [] }]
     #swagger.requestBody = {
        required: true,
        schema: { $ref: "#/components/schemas/verifyKhaltiPayment" }
     }
     */
    const payment = await verifyKhaltiPaymentService(
        req.body.booking_id,
        req.body.transaction_id,
        req.auth_user
    )
    return {
        statusCode: 200,
        message: 'Khalti payment verified successfully',
        data: payment,
    }
})

export const getPaymentHandler = asyncWrapper(async (req, res) => {
    /**
     #swagger.tags = ["Payments"]
     #swagger.security = [{ "bearerAuth": [] }]
     #swagger.parameters['id'] = {
        in: 'path',
        schema: { type: 'string' }
     }
     */
    const payment = await getPaymentService(req.params.id, req.auth_user)
    return {
        statusCode: 200,
        message: 'Payment retrieved successfully',
        data: payment,
    }
})

export const getPaymentByBookingHandler = asyncWrapper(async (req, res) => {
    /**
     #swagger.tags = ["Payments"]
     #swagger.security = [{ "bearerAuth": [] }]
     #swagger.parameters['bookingId'] = {
        in: 'path',
        schema: { type: 'string' }
     }
     */
    const payment = await getPaymentsByBookingService(req.params.bookingId, req.auth_user)
    return {
        statusCode: 200,
        message: 'Payment retrieved successfully',
        data: payment,
    }
})
