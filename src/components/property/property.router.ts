import {
    createPropertyHandler,
    getPropertiesHandler,
    getPropertyHandler,
    updatePropertyHandler,
    deletePropertyHandler,
    uploadPropertyImagesHandler,
    getPropertyImagesHandler,
    deletePropertyImageHandler,
} from './property.controller'
import { propertyValidator, createPropertySchema, updatePropertySchema } from './property.validator'
import { authGuard } from '@/middlewares/auth.middleware'
import { upload, checkFileSize } from '@/middlewares/uploader.middleware'
import { Router } from 'express'

const propertyRouter = Router()

propertyRouter
    .post('/properties', authGuard, propertyValidator(createPropertySchema), createPropertyHandler)
    .get('/properties', getPropertiesHandler)
    .get('/properties/:id', getPropertyHandler)
    .put(
        '/properties/:id',
        authGuard,
        propertyValidator(updatePropertySchema),
        updatePropertyHandler
    )
    .delete('/properties/:id', authGuard, deletePropertyHandler)
    .post(
        '/properties/:id/images',
        authGuard,
        upload.array('images', 10),
        checkFileSize,
        uploadPropertyImagesHandler
    )
    .get('/properties/:id/images', getPropertyImagesHandler)
    .delete('/properties/:id/images/:imageId', authGuard, deletePropertyImageHandler)

export default propertyRouter
