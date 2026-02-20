import { IUser } from '@/utils/query'

export type IRegisterService = {
    username: string
    email: string
    password: string
    name?: string
    role?: string
    phone?: string
}

export type ILoginService = {
    username: string
    password: string
}

export type IOauthAuthorizationService = {
    provider: string
    token: string
}

export type ILogoutService = {
    userId: string
}

export type IForgotPassword = {
    email: IUser['email']
}

export type IChangePasswordService = {
    new_password: string
    token: string
}

export type IRefreshAuthTokenService = {
    refreshToken: string
}
