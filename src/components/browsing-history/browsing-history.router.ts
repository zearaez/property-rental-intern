import {
    getBrowsingHistoryHandler,
    clearBrowsingHistoryHandler,
} from './browsing-history.controller'
import { authGuard } from '@/middlewares/auth.middleware'
import { Router } from 'express'

const browsingHistoryRouter = Router()

browsingHistoryRouter
    .get('/browsing-history', authGuard, getBrowsingHistoryHandler)
    .delete('/browsing-history', authGuard, clearBrowsingHistoryHandler)

export default browsingHistoryRouter
