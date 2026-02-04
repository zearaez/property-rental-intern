import {
    registerHandler,
    loginHandler,
    forgetPasswordHandler,
    changePasswordHandler,
    refreshAuthTokenHandler,
    logoutHandler,
    oauthAuthorizationHandler,
} from './auth.controller'
import {
    authValidator,
    registerSchema,
    loginSchema,
    forgetPasswordSchema,
    changePasswordSchema,
    refreshTokenSchema,
    loginOAuthSchema,
} from './auth.validator'
import { authGuard } from '@/middlewares/auth.middleware'
import { Router } from 'express'

const authRouter = Router()

authRouter
    .post('/register', authValidator(registerSchema), registerHandler)
    .post('/login', authValidator(loginSchema), loginHandler)
    .post('/login/oauth', authValidator(loginOAuthSchema), oauthAuthorizationHandler)
    .post('/logout', authGuard, logoutHandler)
    .post('/forget-password', authValidator(forgetPasswordSchema), forgetPasswordHandler)
    .post('/change-password', authValidator(changePasswordSchema), changePasswordHandler)
    .post('/refresh', authValidator(refreshTokenSchema), refreshAuthTokenHandler)

export default authRouter
