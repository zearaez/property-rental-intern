import prisma, { IUser } from '@/utils/query'
import bcrypt from 'bcryptjs'
import { ApiError } from '@/errors/apiErrors'
import { IChangeProfile, IUserList } from './user.interface'
import { userDTO } from './user.dto'

export const getUsersListService = async (
    payload: IUserList
): Promise<{ data: Partial<IUser>[]; total: number }> => {
    const { user_id, paginateRecords } = payload

    const data = await prisma.users.findMany({
        where: { id: { not: user_id } },
        select: userDTO,
        ...paginateRecords,
    })

    const total = await prisma.users.count({
        where: { id: { not: user_id } },
    })
    return { data, total }
}

export const getProfileService = async (userId: IUser['id']): Promise<Partial<IUser>> => {
    const data = await prisma.users.findFirst({
        where: {
            id: userId,
        },
        select: {
            ...userDTO,
        },
    })
    return data
}

export const getMyLoggedDeviceService = async (
    user_id: IUser['id']
): Promise<any[]> => {
    // Token storage in database has been removed
    // This function is kept for backward compatibility but returns empty array
    return []
}

export const changeProfilePasswordService = async (
    payload: IChangeProfile
): Promise<Partial<IUser>> => {
    const { userId, currentPassword, newPassword } = payload
    const check_user_exist = await prisma.users.findUnique({
        where: { id: userId },
    })
    
    if (!check_user_exist) {
        throw new ApiError(404, 'User not found')
    }
    
    // If user has a password, verify it
    if (check_user_exist.password) {
        if (!currentPassword) throw new ApiError(400, 'Your previous password is required')
        const checkPasswordMatch = bcrypt.compareSync(currentPassword, check_user_exist.password)
        if (!checkPasswordMatch) throw new ApiError(400, 'Previous password not matched!')
    }

    return await prisma.users.update({
        where: { id: userId },
        data: { password: bcrypt.hashSync(newPassword, 10) },
        select: { ...userDTO },
    })
}

export const manageProfileService = async (body: IUser): Promise<Partial<IUser>> => {
    const data = await prisma.users.update({
        where: { id: body.id },
        data: { ...body },
        select: userDTO,
    })
    return data
}
