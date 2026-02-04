import asyncWrapper from '@/utils/asyncWrapper'
import {
    createPropertyService,
    getPropertiesService,
    getPropertyByIdService,
    updatePropertyService,
    deletePropertyService,
} from './property.service'
import {
    uploadPropertyImagesService,
    getPropertyImagesService,
    deletePropertyImageService,
} from './property-images.service'
import { trackBrowsingHistoryService } from '@/components/browsing-history/browsing-history.service'

export const createPropertyHandler = asyncWrapper(async (req, res) => {
    /**
     #swagger.tags = ["Properties"]
     #swagger.security = [{ "bearerAuth": [] }]
     #swagger.requestBody = {
        required: true,
        schema: { $ref: "#/components/schemas/createProperty" }
     }
     */
    const property = await createPropertyService(req.body, req.auth_user)
    return {
        statusCode: 201,
        message: 'Property created successfully',
        data: property,
    }
})

export const getPropertiesHandler = asyncWrapper(async (req, res) => {
    /**
     #swagger.tags = ["Properties"]
     #swagger.parameters['city'] = {
        in: 'query',
        schema: { type: 'string' }
     }
     #swagger.parameters['type'] = {
        in: 'query',
        schema: { type: 'string' }
     }
     #swagger.parameters['minPrice'] = {
        in: 'query',
        schema: { type: 'number' }
     }
     #swagger.parameters['maxPrice'] = {
        in: 'query',
        schema: { type: 'number' }
     }
     #swagger.parameters['status'] = {
        in: 'query',
        schema: { type: 'string', enum: ['AVAILABLE', 'RENTED'] }
     }
     #swagger.parameters['sortBy'] = {
        in: 'query',
        schema: { type: 'string' }
     }
     #swagger.parameters['order'] = {
        in: 'query',
        schema: { type: 'string', enum: ['asc', 'desc'] }
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
    const query = {
        city: req.query.city as string,
        type: req.query.type as string,
        minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
        maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
        status: req.query.status as string,
        sortBy: (req.query.sortBy as string) || 'created_at',
        order: (req.query.order as 'asc' | 'desc') || 'desc',
        page: req.query.page ? Number(req.query.page) : 1,
        limit: req.query.limit ? Number(req.query.limit) : 10,
    }

    const result = await getPropertiesService(query)
    return {
        statusCode: 200,
        message: 'Properties retrieved successfully',
        data: result.data,
        pagination: result.pagination,
    }
})

export const getPropertyHandler = asyncWrapper(async (req, res) => {
    /**
     #swagger.tags = ["Properties"]
     #swagger.parameters['id'] = {
        in: 'path',
        schema: { type: 'string' }
     }
     */
    const property = await getPropertyByIdService(req.params.id)

    // Track browsing history (non-blocking)
    trackBrowsingHistoryService(req.params.id, req.auth_user).catch(() => {})

    return {
        statusCode: 200,
        message: 'Property retrieved successfully',
        data: property,
    }
})

export const updatePropertyHandler = asyncWrapper(async (req, res) => {
    /**
     #swagger.tags = ["Properties"]
     #swagger.security = [{ "bearerAuth": [] }]
     #swagger.parameters['id'] = {
        in: 'path',
        schema: { type: 'string' }
     }
     #swagger.requestBody = {
        required: true,
        schema: { $ref: "#/components/schemas/updateProperty" }
     }
     */
    const property = await updatePropertyService(req.params.id, req.auth_user, req.body)
    return {
        statusCode: 200,
        message: 'Property updated successfully',
        data: property,
    }
})

export const deletePropertyHandler = asyncWrapper(async (req, res) => {
    /**
     #swagger.tags = ["Properties"]
     #swagger.security = [{ "bearerAuth": [] }]
     #swagger.parameters['id'] = {
        in: 'path',
        schema: { type: 'string' }
     }
     */
    await deletePropertyService(req.params.id, req.auth_user)
    return {
        statusCode: 200,
        message: 'Property deleted successfully',
        data: null,
    }
})

export const uploadPropertyImagesHandler = asyncWrapper(async (req, res) => {
    /**
     #swagger.tags = ["Properties"]
     #swagger.security = [{ "bearerAuth": [] }]
     #swagger.parameters['id'] = {
        in: 'path',
        schema: { type: 'string' }
     }
     */
    const images = await uploadPropertyImagesService(req.params.id, req.auth_user, req.files as Express.Multer.File[])
    return {
        statusCode: 201,
        message: 'Images uploaded successfully',
        data: images,
    }
})

export const getPropertyImagesHandler = asyncWrapper(async (req, res) => {
    /**
     #swagger.tags = ["Properties"]
     #swagger.parameters['id'] = {
        in: 'path',
        schema: { type: 'string' }
     }
     */
    const images = await getPropertyImagesService(req.params.id)
    return {
        statusCode: 200,
        message: 'Images retrieved successfully',
        data: images,
    }
})

export const deletePropertyImageHandler = asyncWrapper(async (req, res) => {
    /**
     #swagger.tags = ["Properties"]
     #swagger.security = [{ "bearerAuth": [] }]
     #swagger.parameters['id'] = {
        in: 'path',
        schema: { type: 'string' }
     }
     #swagger.parameters['imageId'] = {
        in: 'path',
        schema: { type: 'string' }
     }
     */
    await deletePropertyImageService(req.params.id, req.params.imageId, req.auth_user)
    return {
        statusCode: 200,
        message: 'Image deleted successfully',
        data: null,
    }
})
