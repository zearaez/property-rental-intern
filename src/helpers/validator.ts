import Joi from 'joi'
import { ApiError } from '@/errors/apiErrors'

/**
 * Utility helper for Joi validation.
 *
 * @param   {T} data
 * @param   {Joi.Schema} schema
 * @returns {Promise<T>}
 * @throws {ApiError}
 */
export const validate = async <T>(data: T, schema: Joi.Schema): Promise<T> => {
    const { error, value } = schema.validate(data, { abortEarly: false, allowUnknown: true })

    if (error) {
        const formattedError = error.details.map((detail) => ({
            message: detail.message,
            path: detail.path,
            type: detail.type,
        }))

        return Promise.reject(
            new ApiError(422, error.message, false, JSON.stringify(formattedError))
        )
    }

    return Promise.resolve(value as T)
}
