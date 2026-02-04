import Joi, { Schema } from 'joi'
import { Request, Response, NextFunction } from 'express'
import { validate } from '@/helpers/validator'

export const createInquirySchema = Joi.object({
    message: Joi.string().min(10).required().label('Message'),
    property_id: Joi.string().uuid().required().label('Property ID'),
})

export const inquiryValidator = (schema: Schema) => {
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
