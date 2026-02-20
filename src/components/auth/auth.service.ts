import { ApiError } from '@/errors/apiErrors'
import bcrypt from 'bcryptjs'
import prisma, { IUser, IPrismaClient } from '@/utils/query'
import { generateAccessToken, generateRefreshToken } from '@/helpers/jwt'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { config } from '@/config/config'
import { genRandomDigest } from '@/helpers/generator'
import {
    IChangePasswordService,
    IForgotPassword,
    ILoginService,
    ILogoutService,
    IOauthAuthorizationService,
    IRefreshAuthTokenService,
    IRegisterService,
} from './auth.interface'

export const registerService = async (body: IRegisterService): Promise<Partial<IUser>> => {
    const { username, email, password } = body
    
    // Check if username already exists
    const existingUsername = await prisma.users.findUnique({
        where: {
            username: username,
        },
    })
    if (existingUsername) throw new ApiError(400, 'Username already exists')
    
    // Check if email already exists
    const existingEmail = await prisma.users.findUnique({
        where: {
            email: email,
        },
    })
    if (existingEmail) throw new ApiError(400, 'Email already exists')

    const hash = bcrypt.hashSync(password, 10)

    const createdUser = await prisma.$transaction(async (txn: IPrismaClient) => {
        const userResBody = {
            username: body.username,
            email: body.email,
            password: hash,
            name: body.name || 'New User',
            role: (body.role || 'GUEST') as any,
            phone: body.phone || '',
        }
        const user = await txn.users.create({
            data: userResBody as any,
            select: {
                id: true,
                username: true,
                email: true,
                name: true,
                role: true,
                phone: true,
                created_at: true,
                updated_at: true,
            },
        })
        return user
    })

    return createdUser
}

export const loginService = async (
    payload: ILoginService
): Promise<Partial<IUser & { accessToken: string; refreshToken: string }>> => {
    const { username, password } = payload

    const user = await prisma.users.findFirst({
        where: {
            username: {
                equals: username,
                mode: 'insensitive',
            },
        },
    })
    
    if (!user) throw new ApiError(404, 'User not found')
    
    if (!user.password) {
        throw new ApiError(400, 'Password not set for this account. Please use password reset.')
    }

    const hash = bcrypt.compareSync(password, user.password)
    if (!hash) {
        throw new ApiError(400, 'Incorrect password')
    }

    const tokenPayload = { id: user.id }
    const accessToken = generateAccessToken(tokenPayload, config('accessExpiry'))
    const refreshToken = generateRefreshToken(tokenPayload, config('refreshExpiry'))

    const userResponse = {
        user: {
            id: user.id,
            username: user.username,
            name: user.name,
            email: user.email,
            role: user.role,
        },
        accessToken,
        refreshToken,
    }

    return userResponse
}

export const oauthAuthorizationService = async (
    oauthPayload: IOauthAuthorizationService
): Promise<Partial<IUser & { accessToken: string; refreshToken: string }>> => {
    // OAuth integration would go here
    throw new ApiError(501, 'OAuth not yet implemented')
}

export const logoutService = async (payload: ILogoutService): Promise<boolean> => {
    // Token invalidation would be handled via Redis blacklist or JWT expiry
    // For now, logout is handled on client side
    return true
}

export const forgetPasswordService = async (
    payload: IForgotPassword
): Promise<{ name: string; otp: number; token: string }> => {
    const { email } = payload
    const currentUser = await prisma.users.findFirst({
        where: { email },
    })
    if (!currentUser) {
        throw new ApiError(404, 'User not found')
    }
    // In production, you would:
    // 1. Generate OTP
    // 2. Store it in Redis with expiry
    // 3. Send email to user
    const otp = Math.floor(100000 + Math.random() * 900000)
    const token = genRandomDigest()
    
    return {
        name: currentUser.name,
        token: token,
        otp: otp,
    }
}

export const changePasswordService = async (
    payload: IChangePasswordService
): Promise<Partial<IUser>> => {
    const { new_password, token } = payload
    // In production, verify OTP from Redis first
    
    // For now, just update the password (in production, verify OTP first)
    const updatedUser = await prisma.users.update({
        where: { id: token }, // In production, lookup user by verified OTP
        data: {
            password: bcrypt.hashSync(new_password, 10),
        },
        select: {
            id: true,
            email: true,
            name: true,
            role: true,
            phone: true,
            created_at: true,
            updated_at: true,
        },
    })
    return updatedUser
}

export const refreshAuthTokenService = async (
    payload: IRefreshAuthTokenService
): Promise<{ accessToken: string; refreshToken: string }> => {
    const { refreshToken } = payload
    if (!refreshToken) {
        throw new ApiError(400, 'Refresh token is required')
    }

    try {
        const decode = jwt.verify(refreshToken, config('secretRefresh')) as JwtPayload
        const user = await prisma.users.findFirst({
            where: { id: decode.id },
        })

        if (!user) {
            throw new ApiError(401, 'User no longer exists')
        }

        const decodedPayload = { id: user.id }
        const accessToken = generateAccessToken(decodedPayload, config('accessExpiry'))
        const newRefreshToken = generateRefreshToken(decodedPayload, config('refreshExpiry'))

        return {
            accessToken,
            refreshToken: newRefreshToken,
        }
    } catch (error) {
        throw new ApiError(401, 'Invalid refresh token')
    }
}
