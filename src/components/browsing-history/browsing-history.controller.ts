import asyncWrapper from '@/utils/asyncWrapper'
import { getBrowsingHistoryService, clearBrowsingHistoryService } from './browsing-history.service'

export const getBrowsingHistoryHandler = asyncWrapper(async (req, res) => {
    /**
     #swagger.tags = ["Browsing History"]
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

    const result = await getBrowsingHistoryService(req.auth_user, page, limit)
    return {
        statusCode: 200,
        message: 'Browsing history retrieved successfully',
        data: result.data,
        pagination: result.pagination,
    }
})

export const clearBrowsingHistoryHandler = asyncWrapper(async (req, res) => {
    /**
     #swagger.tags = ["Browsing History"]
     #swagger.security = [{ "bearerAuth": [] }]
     */
    await clearBrowsingHistoryService(req.auth_user)
    return {
        statusCode: 200,
        message: 'Browsing history cleared',
        data: null,
    }
})
