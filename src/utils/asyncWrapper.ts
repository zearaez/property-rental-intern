import { Request, Response, NextFunction, RequestHandler } from 'express'
import { UserRole } from '@/utils/query'
import { IReturnResponse, IPageParams } from '@/interfaces/response'
import { Socket, Server } from 'socket.io'
import { logger } from '@/helpers/logger'

const returnResponse = (
    { statusCode, data, message, pagination }: IReturnResponse,
    res: Response
) => {
    res.status(statusCode || 200).json({
        ok: true,
        error: false,
        statusCode: statusCode || 200,
        message: message || 'SUCCESS',
        data: data,
        pagination: pagination,
    })
}

declare global {
    namespace Express {
        interface Request {
            //VALUES
            token_ref: string
            auth_user: string
            user_role: UserRole
            user_instance: string
            token_expiration: number
            pagination: IPageParams['pagination']
            paginateRecords: IPageParams['paginateRecords']
            //SOCKET INSTANCES
            userSocketInstance: Socket
            io: Server
        }
    }
}

type AsyncRequestHandler = (
    req: Request,
    res: Response,
    next: NextFunction
) => Promise<IReturnResponse>

const asyncWrapper = (fn: AsyncRequestHandler): RequestHandler => {
    return (req: Request, res: Response, next: NextFunction): void => {
        fn(req, res, next)
            .then((result) => {
                return returnResponse(result, res)
            })
            .catch((err) => {
                logger.error(err)
                return next(err)
            })
    }
}

export default asyncWrapper
