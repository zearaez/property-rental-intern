// Error type with status
export interface IError extends Error {
    statusCode?: number
    fieldname?: string
    isOperational?: boolean
}
