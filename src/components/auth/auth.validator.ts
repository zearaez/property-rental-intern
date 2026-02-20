import Joi, { Schema } from 'joi'
import { Request, Response, NextFunction } from 'express'
import { validate } from '@/helpers/validator'

export const registerSchema = Joi.object({
    username: Joi.string().label('Username').min(3).max(30).required().messages({
        'string.min': 'Username must be at least 3 characters long',
        'string.max': 'Username must not exceed 30 characters',
    }),
    name: Joi.string().label('Name').required(),
    email: Joi.string().email().label('Email').required(),
    phone: Joi.string().label('Phone').allow('', null).optional(),
    role: Joi.string().valid('GUEST', 'HOST').label('Role').optional(),
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
    username: Joi.string().label('Username').required(),
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
