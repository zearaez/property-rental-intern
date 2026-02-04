import { noteUploadHandler } from './file.controller'
import { authGuard } from '@/middlewares/auth.middleware'
import { Router } from 'express'
import { upload } from '@/middlewares/uploader.middleware'

const fileRouter = Router()

fileRouter.post('/', authGuard, upload.array('files'), noteUploadHandler)

export default fileRouter
