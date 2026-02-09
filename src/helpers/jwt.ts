import { config } from '@/config/config'
import jwt, { SignOptions } from 'jsonwebtoken'

export interface IJwtPayload {
    id: string
}

export const generateAccessToken = (payload: IJwtPayload, expire: string) => {
    const options: SignOptions = {
        expiresIn: expire as any,
        issuer: config('jwtIssuer'),
    }
    return jwt.sign(payload, config('secretAccess') as string, options)
}

export const generateRefreshToken = (payload: IJwtPayload, expire: string) => {
    const options: SignOptions = {
        expiresIn: expire as any,
        issuer: config('jwtIssuer'),
    }
    return jwt.sign(payload, config('secretRefresh') as string, options)
}
