import axios from 'axios'
import { IUser } from './query'
import jwt from 'jsonwebtoken'
import { logger } from '@/helpers/logger'

// Note: OAuth functionality is not currently used in this simple property rental platform
// These functions are kept as placeholders for future social login implementation

export const handleGoogleOauth = async (access_token: string): Promise<Partial<IUser>> => {
    try {
        const { data: profile } = await axios.get('https://www.googleapis.com/oauth2/v1/userinfo', {
            headers: { Authorization: `Bearer ${access_token}` },
        })
        return {
            name: `${profile.given_name || ''} ${profile.family_name || ''}`.trim(),
            email: profile.email,
        }
    } catch (err) {
        logger.error(err)
        throw new Error('Login failed, Please try again !')
    }
}

export const handleAppleOuth = async (id_token: string): Promise<Partial<IUser>> => {
    try {
        const applePublicKey = await axios.get(`https://appleid.apple.com/auth/keys`)
        const data = jwt.verify(id_token, applePublicKey.data, {
            algorithms: ['RS256'],
        }) as any
        return {
            name: data.name || '',
            email: data.email || '',
        }
    } catch (err) {
        throw new Error('Login failed, Please try again !')
    }
}
