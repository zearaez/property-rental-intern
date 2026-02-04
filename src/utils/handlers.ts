import { IError } from '@/interfaces/error'
import { NextFunction, Request, Response } from 'express'
import { JsonWebTokenError } from 'jsonwebtoken'
import { MulterError } from 'multer'
import { config } from '@/config/config'
import { logger } from '@/helpers/logger'
import { ApiError } from '@/errors/apiErrors'

export const globalErrorHandlers = (
    error: IError,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const { userSocketInstance } = req
    let { statusCode, message, stack } = error
    let fields: any[] = []
    logger.error(error)
    if (error.name === 'PrismaClientValidationError') {
        statusCode = 502
        message = 'Database error'
    }
    if (error instanceof JsonWebTokenError) {
        statusCode = 401
        message = 'Authentication Failed'
        userSocketInstance?.disconnect()
    }
    if (error instanceof MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            statusCode = 400
            message = `File must be lessthan ${config('fileSize')} MB`
        }
    }
    res.status(statusCode || 500).json({
        ok: false,
        error: true,
        fields: fields,
        data: null,
        message: message ?? 'Error',
        stack: process.env.NODE_ENV !== 'production' && stack,
    })
    return
}

export const notfoundHandlers = (req: Request, res: Response, next: NextFunction): void => {
    throw new ApiError(404, `${req.originalUrl} not found !!!`)
}

export const greetingHandler = (req: Request, res: Response) => {
    const htmlContent =
        '<html><head><title>Boilerplate</title></head><body style="text-align:center"><h1>Welcome</h1></body></html>'
    res.send(htmlContent)
}

export const severCheckHandler = (req: Request, res: Response) => {
    res.status(200).json({ status: 'OKAY' })
}
