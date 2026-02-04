import { config } from '@/config/config'
import jwt from 'jsonwebtoken'

export interface IJwtPayload {
    id: string
}

export const generateAccessToken = (payload: IJwtPayload, expire: string) => {
    return jwt.sign(payload, config('secretAccess'), {
        expiresIn: expire,
        issuer: config('jwtIssuer'),
    })
}

export const generateRefreshToken = (payload: IJwtPayload, expire: string) => {
    return jwt.sign(payload, config('secretRefresh'), {
        expiresIn: expire,
        issuer: config('jwtIssuer'),
    })
}
