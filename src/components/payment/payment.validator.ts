import Joi, { Schema } from 'joi'
import { Request, Response, NextFunction } from 'express'
import { validate } from '@/helpers/validator'

export const createStripeIntentSchema = Joi.object({
    booking_id: Joi.string().uuid().required().label('Booking ID'),
})

export const confirmStripePaymentSchema = Joi.object({
    payment_intent_id: Joi.string().required().label('Payment Intent ID'),
})

export const initiateKhaltiPaymentSchema = Joi.object({
    booking_id: Joi.string().uuid().required().label('Booking ID'),
})

export const verifyKhaltiPaymentSchema = Joi.object({
    transaction_id: Joi.string().required().label('Transaction ID'),
})

export const paymentValidator = (schema: Schema) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const validated = await validate(schema, req.body)
            req.body = validated
            next()
        } catch (error) {
            next(error)
        }
    }
}
