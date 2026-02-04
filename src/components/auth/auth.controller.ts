import {
    registerService,
    loginService,
    oauthAuthorizationService,
    forgetPasswordService,
    changePasswordService,
    refreshAuthTokenService,
    logoutService,
} from './auth.service'
import asyncWrapper from '@/utils/asyncWrapper'
import { removeAllOnlineUsers } from '@/service/redis/user.redis.service'
import { addDaysToString } from './auth.helper'
import { config } from '@/config/config'

/*
----------------------- LOGIN ( INCLUDING OAUTH ) ---------------------------
*/
export const loginHandler = asyncWrapper(async (req, res) => {
    /**
     #swagger.tags = ["Auth"]
     #swagger.requestBody = {  
        required: true,  
        schema: { $ref: "#/components/schemas/login" }  
    }  
     */
    const data = req.body
    const response = await loginService(data)
    res.cookie('access_token', response.accessToken, {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
        expires: addDaysToString(config('accessExpiry')),
    })
    res.cookie('refresh_token', response.refreshToken, {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
        expires: addDaysToString(config('refreshExpiry')),
    })
    return {
        message: 'Successfully Loggedin',
        data: response,
    }
})

export const oauthAuthorizationHandler = asyncWrapper(async (req, res) => {
    /**
    #swagger.tags = ["Auth"]
    #swagger.requestBody = {  
            required: true,  
            schema: { $ref: "#/components/schemas/oauthLogin" }  
        }  
     */
    const response = await oauthAuthorizationService({ ...req.body })

    if (response.accessToken && response.refreshToken) {
        res.cookie('access_token', response.accessToken, {
            httpOnly: true,
            sameSite: 'none',
            secure: true,
            expires: addDaysToString(config('accessExpiry')),
        })
        res.cookie('refresh_token', response.refreshToken, {
            httpOnly: true,
            sameSite: 'none',
            secure: true,
            expires: addDaysToString(config('refreshExpiry')),
        })
    }

    return {
        message: 'Successfully Loggedin',
        data: response,
    }
})

export const refreshAuthTokenHandler = asyncWrapper(async (req, res) => {
    /**
     #swagger.tags = ["Auth"]
     #swagger.requestBody = {  
        required: true,  
        schema: { $ref: "#/components/schemas/refreshToken" }  
    }  
     */
    const response = await refreshAuthTokenService({
        refreshToken: req.cookies['refresh_token'],
        ...req.body,
    })
    res.cookie('access_token', response.accessToken, {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
        expires: addDaysToString(config('accessExpiry')),
    })
    res.cookie('refresh_token', response.refreshToken, {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
        expires: addDaysToString(config('refreshExpiry')),
    })
    return { data: response }
})

/*
------------------- REGISTRATION CONTROLLER -------------------------
*/
export const registerHandler = asyncWrapper(async (req, res) => {
    /**
    #swagger.tags = ["Auth"]
    #swagger.requestBody = {
        required: true,
        schema: { $ref: "#/components/schemas/register" }
    }
    */
    const data = req.body
    const response = await registerService(data)
    return { data: { ...response } }
})

export const logoutHandler = asyncWrapper(async (req, res) => {
    /**
     #swagger.tags = ["Auth"]
     */
    const { userSocketInstance } = req
    await logoutService({
        userId: req.auth_user || '',
    })
    res.clearCookie('access_token')
    res.clearCookie('refresh_token')
    userSocketInstance?.disconnect()
    return { message: 'Successfully Loggedout!' }
})

/*
-------------------------------- FORGOT PASSWORD ----------------------------------------------
*/
export const forgetPasswordHandler = asyncWrapper(async (req) => {
    /**
    #swagger.tags = ["Auth"]
    #swagger.requestBody = {  
        required: true,  
        schema: { $ref: "#/components/schemas/forgotPassword" }  
    }  
     */
    const data = req.body
    const list = await forgetPasswordService(data)

    return {
        data: { token: list.token },
        message: 'OTP has been send to your given email successfully.',
    }
})

export const changePasswordHandler = asyncWrapper(async (req) => {
    /**  
    #swagger.tags = ["Auth"]
    #swagger.requestBody = {  
        required: true,  
        schema: { $ref: "#/components/schemas/changePassword" }  
    }  
     */
    const { userSocketInstance } = req
    const response = await changePasswordService(req.body)
    await removeAllOnlineUsers(response.id)
    userSocketInstance?.disconnect()
    return {
        data: response,
        message: 'Password Reset Successfullly',
    }
})
