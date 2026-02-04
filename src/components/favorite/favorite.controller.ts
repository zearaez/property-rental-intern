import asyncWrapper from '@/utils/asyncWrapper'
import {
    addToFavoritesService,
    getFavoritesService,
    removeFromFavoritesService,
} from './favorite.service'

export const addToFavoritesHandler = asyncWrapper(async (req, res) => {
    /**
     #swagger.tags = ["Favorites"]
     #swagger.security = [{ "bearerAuth": [] }]
     #swagger.requestBody = {
        required: true,
        schema: { $ref: "#/components/schemas/addFavorite" }
     }
     */
    const favorite = await addToFavoritesService(req.auth_user, req.body.property_id)
    return {
        statusCode: 201,
        message: 'Property added to favorites',
        data: favorite,
    }
})

export const getFavoritesHandler = asyncWrapper(async (req, res) => {
    /**
     #swagger.tags = ["Favorites"]
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

    const result = await getFavoritesService(req.auth_user, page, limit)
    return {
        statusCode: 200,
        message: 'Favorites retrieved successfully',
        data: result.data,
        pagination: result.pagination,
    }
})

export const removeFromFavoritesHandler = asyncWrapper(async (req, res) => {
    /**
     #swagger.tags = ["Favorites"]
     #swagger.security = [{ "bearerAuth": [] }]
     #swagger.parameters['id'] = {
        in: 'path',
        schema: { type: 'string' }
     }
     */
    await removeFromFavoritesService(req.auth_user, req.params.id)
    return {
        statusCode: 200,
        message: 'Property removed from favorites',
        data: null,
    }
})
