import { createInquiryHandler, getInquiriesHandler, getInquiryHandler } from './inquiry.controller'
import { inquiryValidator, createInquirySchema } from './inquiry.validator'
import { authGuard } from '@/middlewares/auth.middleware'
import { Router } from 'express'

const inquiryRouter = Router()

inquiryRouter
    .post('/inquiries', authGuard, inquiryValidator(createInquirySchema), createInquiryHandler)
    .get('/inquiries', authGuard, getInquiriesHandler)
    .get('/inquiries/:id', authGuard, getInquiryHandler)

export default inquiryRouter
