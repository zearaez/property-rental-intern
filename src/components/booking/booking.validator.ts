import Joi, { Schema } from 'joi'
import { Request, Response, NextFunction } from 'express'
import { validate } from '@/helpers/validator'

export const createBookingSchema = Joi.object({
    property_id: Joi.string().uuid().required().label('Property ID'),
    start_date: Joi.date().iso().required().label('Start Date'),
    end_date: Joi.date().iso().required().label('End Date'),
})

export const updateBookingSchema = Joi.object({
    start_date: Joi.date().iso().optional().label('Start Date'),
    end_date: Joi.date().iso().optional().label('End Date'),
})

export const bookingValidator = (schema: Schema) => {
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
