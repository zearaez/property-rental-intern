import prisma from '@/utils/query'
import { AuditAction } from '@prisma/client'

export interface IAuditLogParams {
    entity: string
    entityId: string
    action: AuditAction
    oldData?: any
    newData?: any
    userId?: string
    ipAddress: string
    userAgent: string
}

export const createAuditLogService = async (params: IAuditLogParams): Promise<void> => {
    try {
        await prisma.audit_logs.create({
            data: {
                entity: params.entity,
                entity_id: params.entityId,
                action: params.action,
                old_data: params.oldData || {},
                new_data: params.newData || {},
                user_id: params.userId || null,
                ip_address: params.ipAddress,
                user_agent: params.userAgent,
            },
        })
    } catch (error) {
        // Log errors but don't throw to prevent disrupting main operations
        console.error('Error creating audit log:', error)
    }
}

export const getAuditLogsService = async (
    filters: {
        entity?: string
        entityId?: string
        action?: AuditAction
        userId?: string
        startDate?: Date
        endDate?: Date
        page?: number
        limit?: number
    }
): Promise<any> => {
    const page = filters.page || 1
    const limit = filters.limit || 10
    const skip = (page - 1) * limit

    const where: any = {}

    if (filters.entity) {
        where.entity = filters.entity
    }

    if (filters.entityId) {
        where.entity_id = filters.entityId
    }

    if (filters.action) {
        where.action = filters.action
    }

    if (filters.userId) {
        where.user_id = filters.userId
    }

    if (filters.startDate || filters.endDate) {
        where.created_at = {}
        if (filters.startDate) {
            where.created_at.gte = filters.startDate
        }
        if (filters.endDate) {
            where.created_at.lte = filters.endDate
        }
    }

    const [logs, total] = await Promise.all([
        prisma.audit_logs.findMany({
            where,
            select: {
                id: true,
                entity: true,
                entity_id: true,
                action: true,
                old_data: true,
                new_data: true,
                user_id: true,
                ip_address: true,
                user_agent: true,
                created_at: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
            skip,
            take: limit,
            orderBy: {
                created_at: 'desc',
            },
        }),
        prisma.audit_logs.count({ where }),
    ])

    return {
        data: logs,
        pagination: {
            page,
            limit,
            totalItems: total,
            totalPages: Math.ceil(total / limit),
        },
    }
}
