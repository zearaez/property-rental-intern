import { NextFunction } from 'express'
import { Socket } from 'socket.io'
import { logger } from '@/helpers/logger'
import { joinUserRoom } from './controller/user.socket'
import { removeOnlineUser } from '../redis/user.redis.service'

export const socketService = async (socket: Socket, next: NextFunction) => {
    try {
        logger.info('SOCKET CONNECTION SUCCESS')

        await joinUserRoom({
            params: {
                message: `${socket.data.auth_user} has joined personal his own room`,
            },
            socketParams: { socket },
        })

        socket.on('disconnect', async () => {
            await removeOnlineUser({
                user_id: socket.data.auth_user,
                user_instance: socket.data.user_instance,
            })
        })

        next()
    } catch (err) {
        logger.error('SOCKET CONNECTION FAILURE !')
        logger.error(err)
    }
}
