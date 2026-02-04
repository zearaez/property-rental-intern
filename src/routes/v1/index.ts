import authRouter from '@/components/auth/auth.router'
import fileRouter from '@/components/file/file.router'
import userRouter from '@/components/user/user.router'
import propertyRouter from '@/components/property/property.router'
import favoriteRouter from '@/components/favorite/favorite.router'
import browsingHistoryRouter from '@/components/browsing-history/browsing-history.router'
import inquiryRouter from '@/components/inquiry/inquiry.router'
import bookingRouter from '@/components/booking/booking.router'
import paymentRouter from '@/components/payment/payment.router'
import auditRouter from '@/components/audit/audit.router'

import express from 'express'

const v1 = express()

v1.use('/auth', authRouter)
    .use('/user', userRouter)
    .use('/files', fileRouter)
    .use('/', propertyRouter)
    .use('/', favoriteRouter)
    .use('/', browsingHistoryRouter)
    .use('/', inquiryRouter)
    .use('/', bookingRouter)
    .use('/', paymentRouter)
    .use('/', auditRouter)

export default v1
