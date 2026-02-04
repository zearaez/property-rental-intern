import {
    changeProfilePasswordHandler,
    getMyDevicesHandler,
    getProfileHandler,
    getUsersHandler,
    updateProfileHandler,
} from './user.controller'

import { Router } from 'express'
import { authGuard, hasRole } from '@/middlewares/auth.middleware'
import { paginationFilter } from '@/middlewares/pagination.middleware'
import { userValidator, profileUpdateSchema, profilePasswordSchema } from './user.validator'

const userRouter = Router()

userRouter
    .get(
        '/admin/users',
        authGuard,
        hasRole(['HOST']),
        paginationFilter,
        getUsersHandler
    )
    .get('/profile', authGuard, getProfileHandler)
    .get('/my/devices', authGuard, getMyDevicesHandler)
    .patch(
        '/profile/change-password',
        authGuard,
        userValidator(profilePasswordSchema),
        changeProfilePasswordHandler
    )
    .patch('/profile/manage', authGuard, userValidator(profileUpdateSchema), updateProfileHandler)

export default userRouter
