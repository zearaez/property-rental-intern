import asyncWrapper from '@/utils/asyncWrapper'
import { getAuditLogsService } from '@/services/audit/audit.service'
import { AuditAction } from '@prisma/client'

export const getAuditLogsHandler = asyncWrapper(async (req, res) => {
    /**
     #swagger.tags = ["Audit"]
     #swagger.security = [{ "bearerAuth": [] }]
     #swagger.parameters['entity'] = {
        in: 'query',
        schema: { type: 'string' }
     }
     #swagger.parameters['entityId'] = {
        in: 'query',
        schema: { type: 'string' }
     }
     #swagger.parameters['action'] = {
        in: 'query',
        schema: { type: 'string', enum: ['CREATE', 'UPDATE', 'DELETE', 'RESTORE', 'LOGIN', 'LOGOUT', 'PAYMENT_SUCCESS', 'PAYMENT_FAILED'] }
     }
     #swagger.parameters['userId'] = {
        in: 'query',
        schema: { type: 'string' }
     }
     #swagger.parameters['startDate'] = {
        in: 'query',
        schema: { type: 'string', format: 'date-time' }
     }
     #swagger.parameters['endDate'] = {
        in: 'query',
        schema: { type: 'string', format: 'date-time' }
     }
     #swagger.parameters['page'] = {
        in: 'query',
        schema: { type: 'number' }
     }
     #swagger.parameters['limit'] = {
        in: 'query',
        schema: { type: 'number' }
     }
     */

    const filters = {
        entity: req.query.entity as string,
        entityId: req.query.entityId as string,
        action: req.query.action as AuditAction,
        userId: req.query.userId as string,
        startDate: req.query.startDate ? new Date(req.query.startDate as string) : undefined,
        endDate: req.query.endDate ? new Date(req.query.endDate as string) : undefined,
        page: req.query.page ? Number(req.query.page) : 1,
        limit: req.query.limit ? Number(req.query.limit) : 10,
    }

    const result = await getAuditLogsService(filters)

    return {
        statusCode: 200,
        message: 'Audit logs retrieved successfully',
        data: result.data,
        pagination: result.pagination,
    }
})
