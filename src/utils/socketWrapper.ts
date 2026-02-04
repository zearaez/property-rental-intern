import { Socket, Server } from 'socket.io'
import { logger } from '@/helpers/logger'

type AsyncSocketHandler<P = unknown & { message?: string }> = ({
    params,
    socketParams,
}: {
    params: P
    socketParams: {
        socket?: Socket
        io?: Server
    }
}) => Promise<void>

export const socketWrapper = <P = unknown>(
    handler: AsyncSocketHandler<P & { message?: string }>
): AsyncSocketHandler<P & { message?: string; errMessage?: string }> => {
    return async ({ params, socketParams }) => {
        try {
            if (!socketParams.io && !socketParams.socket) return
            logger.info(params.message || 'socket instance delivered !')
            return await handler({ params, socketParams })
        } catch (error) {
            if (socketParams?.io && socketParams?.socket) {
                socketParams.socket
                    .to(socketParams.socket.id)
                    .emit('socket:err', params?.errMessage)
            }
            logger.error(error)
        }
    }
}
