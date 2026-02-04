import { config } from '@/config/config'
import { NextFunction } from 'express'
import { Socket } from 'socket.io'
import prisma from '@/utils/query'
import jwt, { JsonWebTokenError, JwtPayload } from 'jsonwebtoken'
import { logger } from '@/helpers/logger'

export const socketAuthGuard = async (socket: Socket, next: NextFunction) => {
    try {
        const authorizationToken = socket?.handshake?.auth?.token as string
        if (!authorizationToken) return next(new Error('Authorization token not found !'))

        // Verify JWT token directly (no database token storage)
        const decode = jwt.verify(authorizationToken, config('secretAccess')) as JwtPayload

        const user = await prisma.users.findFirst({
            where: {
                id: decode.id,
            },
        })
        if (!user) {
            socket?.disconnect()
            return next(new Error('User no longer exist or have been removed !'))
        }

        socket.data.user_instance = user.id
        socket.data.auth_user = user.id
        socket.data.token_expiration = decode.exp ? Math.round((decode.exp * 1000 - Date.now()) / 1000) + 100 : 3600
        next()
    } catch (err) {
        if (err instanceof JsonWebTokenError) {
            socket?.disconnect()
        }
        logger.error(err)
    }
}
