import jwt, { JwtPayload } from 'jsonwebtoken'
import { ApiError } from '@/errors/apiErrors'
import { config } from '@/config/config'
import { NextFunction, Request, Response } from 'express'
import prisma, { UserRole } from '@/utils/query'
import { Server as SocketIOServer } from 'socket.io'

export const authGuard = async (req: Request, _: Response, next: NextFunction) => {
    try {
        const cookieToken = { access: req.cookies['access_token'] }
        const token = (): string | null => {
            if (cookieToken.access) return cookieToken.access
            if (req.headers.authorization) return req.headers.authorization.split(' ')[1]
            return null
        }
        const authorizationToken = token()
        if (!authorizationToken) throw new ApiError(401, 'Unauthorised')

        // Verify JWT token directly (no database token storage)
        const decode = jwt.verify(authorizationToken, config('secretAccess')) as JwtPayload

        const user = await prisma.users.findFirst({
            where: {
                id: decode.id,
            },
        })
        if (!user) {
            throw new ApiError(401, 'User no longer exist or have been removed !')
        }
        const appSocket = req.app.get('app_socket') as SocketIOServer
        const userSocketInstance = Array.from(appSocket?.sockets?.sockets?.values()).find((i) => {
            return i?.data?.user_id == user.id
        })

        req.auth_user = user.id
        req.user_role = user.role
        req.user_instance = user.id
        req.token_ref = authorizationToken
        req.userSocketInstance = userSocketInstance
        req.token_expiration = decode.exp
        req.io = appSocket

        next()
    } catch (err) {
        next(err)
    }
}

export const hasRole = (roles: UserRole[]) => {
    return async (req: Request, _: Response, next: NextFunction) => {
        if (!roles.includes(req.user_role)) {
            return next({
                statusCode: 403,
                message: `Permission denied`,
            })
        }
        next()
    }
}
