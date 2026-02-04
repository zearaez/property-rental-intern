import Joi, { Schema } from 'joi'
import { Request, Response, NextFunction } from 'express'
import { validate } from '@/helpers/validator'

export const registerSchema = Joi.object({
    first_name: Joi.string().label('first_name').required(),
    last_name: Joi.string().label('last_name').required(),
    email: Joi.string().email().label('Email').required(),
    provider: Joi.string().label('Provider').allow(null, ''),
    password: Joi.string().label('Password').min(8).required().messages({
        'string.pattern.base': `Given password doesn't match the requirement`,
    }),
    confirm_password: Joi.any()
        .equal(Joi.ref('password'))
        .required()
        .label('Confirm Password')
        .options({ messages: { 'any.only': '{{#label}} does not match' } }),
})

export const loginSchema = Joi.object({
    email: Joi.string().email().label('Email').required(),
    password: Joi.string().label('Password').min(8).required().messages({
        'string.pattern.base': `Given password doesn't match the requirement`,
    }),
})

export const forgetPasswordSchema = Joi.object({
    email: Joi.string().email().label('Email').required(),
})

export const changePasswordSchema = Joi.object({
    token: Joi.string().required(),
    otp_code: Joi.number().required(),
    new_password: Joi.string().label('new_password').min(8).required(),
})

export const refreshTokenSchema = Joi.object({
    refreshToken: Joi.string().optional(),
    platform: Joi.string().valid('PHONE', 'WEB').required(),
    deviceId: Joi.string().label('deviceId').required(),
})

export const loginOAuthSchema = Joi.object({
    provider: Joi.string().valid('GOOGLE', 'APPLE', 'MICROSOFT').required(),
    deviceId: Joi.string().required(),
    platform: Joi.string().valid('PHONE', 'WEB').required(),
    token: Joi.string().required(),
})

export const authValidator = (schema: Schema) => {
    return async (req: Request, _: Response, next: NextFunction) => {
        return validate(req.body, schema)
            .then(() => {
                delete req.body?.confirm_password
                return next()
            })
            .catch((err) => {
                return next(err)
            })
    }
}
