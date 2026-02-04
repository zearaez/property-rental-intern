import Joi, { Schema } from 'joi'
import { Request, Response, NextFunction } from 'express'
import { validate } from '@/helpers/validator'

export const createPropertySchema = Joi.object({
    title: Joi.string().required().label('Title'),
    description: Joi.string().required().label('Description'),
    price: Joi.number().positive().required().label('Price'),
    type: Joi.string().required().label('Type'),
    status: Joi.string().valid('AVAILABLE', 'RENTED').optional(),
    location: Joi.object({
        address: Joi.string().required().label('Address'),
        city: Joi.string().required().label('City'),
        latitude: Joi.number().min(-90).max(90).required().label('Latitude'),
        longitude: Joi.number().min(-180).max(180).required().label('Longitude'),
    })
        .required()
        .label('Location'),
})

export const updatePropertySchema = Joi.object({
    title: Joi.string().optional().label('Title'),
    description: Joi.string().optional().label('Description'),
    price: Joi.number().positive().optional().label('Price'),
    type: Joi.string().optional().label('Type'),
    status: Joi.string().valid('AVAILABLE', 'RENTED').optional().label('Status'),
    location: Joi.object({
        address: Joi.string().optional().label('Address'),
        city: Joi.string().optional().label('City'),
        latitude: Joi.number().min(-90).max(90).optional().label('Latitude'),
        longitude: Joi.number().min(-180).max(180).optional().label('Longitude'),
    })
        .optional()
        .label('Location'),
})

export const propertyValidator = (schema: Schema) => {
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
