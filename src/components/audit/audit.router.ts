import { getAuditLogsHandler } from './audit.controller'
import { authGuard } from '@/middlewares/auth.middleware'
import { Router } from 'express'

const auditRouter = Router()

// TODO: Add role check to restrict to ADMIN only
auditRouter.get('/audit-logs', authGuard, getAuditLogsHandler)

export default auditRouter
