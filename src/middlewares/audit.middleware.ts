import { Request, Response, NextFunction } from 'express'
import { createAuditLogService } from '@/services/audit/audit.service'
import { AuditAction } from '@prisma/client'

/**
 * Middleware to capture and log audit information
 * Usage: Apply to specific routes that need audit logging
 */
export const auditMiddleware = (entity: string, action: AuditAction) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        // Store original res.json
        const originalJson = res.json

        // Override res.json to capture response data
        res.json = function (data: any) {
            // Only audit successful operations
            if (data && data.ok && req.method !== 'GET') {
                const entityId = req.params.id || req.body?.id || data.data?.id
                const userAgent = req.headers['user-agent'] || ''
                const ipAddress = req.ip || req.connection.remoteAddress || ''

                createAuditLogService({
                    entity,
                    entityId: entityId || 'unknown',
                    action,
                    newData: data.data || {},
                    userId: req.auth_user,
                    ipAddress,
                    userAgent,
                }).catch(console.error)
            }

            // Call original json
            return originalJson.call(this, data)
        }

        next()
    }
}

/**
 * Capture old data before update operations
 * Usage: Apply before update handlers to store before state
 */
export const captureOldDataMiddleware = (entity: string) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        if (req.method === 'PUT' || req.method === 'PATCH' || req.method === 'DELETE') {
            // Store entity ID for audit
            req.body._entityId = req.params.id

            // Retrieve current state if needed
            // This can be extended to actually fetch current data from DB
        }
        next()
    }
}
