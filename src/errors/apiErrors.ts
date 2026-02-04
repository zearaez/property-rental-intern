export class ApiError extends Error {
    statusCode: number
    isOperational: boolean
    description: string

    constructor(
        statusCode: number,
        description: string,
        isOperational: boolean = false,
        stack?: string
    ) {
        super(description)

        Object.setPrototypeOf(this, new.target.prototype)

        this.name = 'CUSTOM_ERROR'
        this.statusCode = statusCode
        this.isOperational = isOperational

        if (stack) {
            this.stack = stack
        } else {
            Error.captureStackTrace(this, this.constructor)
        }
    }
}
