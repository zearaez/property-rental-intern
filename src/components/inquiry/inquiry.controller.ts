import asyncWrapper from '@/utils/asyncWrapper'
import { createInquiryService, getInquiriesService, getInquiryByIdService } from './inquiry.service'

export const createInquiryHandler = asyncWrapper(async (req, res) => {
    /**
     #swagger.tags = ["Inquiries"]
     #swagger.security = [{ "bearerAuth": [] }]
     #swagger.requestBody = {
        required: true,
        schema: { $ref: "#/components/schemas/createInquiry" }
     }
     */
    const inquiry = await createInquiryService(req.body, req.auth_user)
    return {
        statusCode: 201,
        message: 'Inquiry created successfully',
        data: inquiry,
    }
})

export const getInquiriesHandler = asyncWrapper(async (req, res) => {
    /**
     #swagger.tags = ["Inquiries"]
     #swagger.security = [{ "bearerAuth": [] }]
     #swagger.parameters['page'] = {
        in: 'query',
        schema: { type: 'number' }
     }
     #swagger.parameters['limit'] = {
        in: 'query',
        schema: { type: 'number' }
     }
     */
    const page = req.query.page ? Number(req.query.page) : 1
    const limit = req.query.limit ? Number(req.query.limit) : 10

    const result = await getInquiriesService(req.auth_user, req.user_role, page, limit)
    return {
        statusCode: 200,
        message: 'Inquiries retrieved successfully',
        data: result.data,
        pagination: result.pagination,
    }
})

export const getInquiryHandler = asyncWrapper(async (req, res) => {
    /**
     #swagger.tags = ["Inquiries"]
     #swagger.security = [{ "bearerAuth": [] }]
     #swagger.parameters['id'] = {
        in: 'path',
        schema: { type: 'string' }
     }
     */
    const inquiry = await getInquiryByIdService(req.params.id, req.auth_user)
    return {
        statusCode: 200,
        message: 'Inquiry retrieved successfully',
        data: inquiry,
    }
})
