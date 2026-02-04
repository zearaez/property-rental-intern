import { validate } from '@/helpers/validator'
import Joi, { Schema } from 'joi'
import { Request, Response, NextFunction } from 'express'

export const profilePasswordSchema = Joi.object({
    currentPassword: Joi.string().optional(),
    newPassword: Joi.string().label('new_password').min(8).required(),
})

export const profileUpdateSchema = Joi.object({
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    phone: Joi.string().optional(),
    profile_picture: Joi.string().optional(),
    bio: Joi.string().optional(),
})

export const userValidator = (schema: Schema, isQuery?: boolean) => {
    return async (req: Request, _: Response, next: NextFunction) => {
        return validate(isQuery ? req.query : req.body, schema)
            .then(() => {
                return next()
            })
            .catch((err) => {
                return next(err)
            })
    }
}
