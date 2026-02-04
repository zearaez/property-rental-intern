import { socketWrapper } from '@/utils/socketWrapper'
import { addUsersOnline } from '@/service/redis/user.redis.service'

export const joinUserRoom = socketWrapper(async ({ socketParams: { socket } }) => {
    await addUsersOnline({
        user_id: socket.data.auth_user,
        user_instance: socket.data.user_instance,
        exp: socket.data.token_expiration,
    })
    socket.join(socket.data.user_instance)
})
