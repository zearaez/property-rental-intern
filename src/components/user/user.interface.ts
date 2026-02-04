import { IPageParams } from '@/interfaces/response'
import { IUser } from '@/utils/query'

export type IChangeProfile = {
    userId: IUser['id']
    currentPassword?: string
    newPassword: string
}

export type IUserList = {
    user_id: IUser['id']
    paginateRecords: IPageParams['paginateRecords']
}
