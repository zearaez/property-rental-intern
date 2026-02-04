import { redisClient } from '@/utils/redis'
import { IUser } from '@/utils/query'

type IOnlineUser = { user_id: IUser['id']; user_instance: string; exp?: number }

export const addUsersOnline = async (payload: IOnlineUser): Promise<string> => {
    const { user_id, user_instance, exp } = payload
    await redisClient.set(`${user_id}__${user_instance}`, user_instance, {
        EX: exp,
    })
    return user_instance
}

export const removeOnlineUser = async (payload: IOnlineUser) => {
    const { user_id, user_instance } = payload
    await redisClient.del(`${user_id}__${user_instance}`)
}

export const removeAllOnlineUsers = async (user_id: IUser['id']) => {
    const currentInstance = await redisClient.scan(0, { MATCH: `${user_id}__*` })
    if (!currentInstance?.keys || !currentInstance?.keys?.length) return
    await redisClient.del(currentInstance.keys)
}

export const activeUserInstances = async (user_id: IUser['id']): Promise<string[]> => {
    const currentInstance = await redisClient.scan(0, { MATCH: `${user_id}__*` })
    return currentInstance.keys.map((key) => key.split('__')[1])
}
