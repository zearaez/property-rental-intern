import asyncWrapper from '@/utils/asyncWrapper'
import {
    createBookingService,
    getBookingsService,
    getBookingByIdService,
    updateBookingService,
    deleteBookingService,
    updateBookingStatusService,
} from './booking.service'
import { BookingStatus } from '@prisma/client'

export const createBookingHandler = asyncWrapper(async (req, res) => {
    /**
     #swagger.tags = ["Bookings"]
     #swagger.security = [{ "bearerAuth": [] }]
     #swagger.requestBody = {
        required: true,
        schema: { $ref: "#/components/schemas/createBooking" }
     }
     */
    const booking = await createBookingService(req.body, req.auth_user)
    return {
        statusCode: 201,
        message: 'Booking created successfully',
        data: booking,
    }
})

export const getBookingsHandler = asyncWrapper(async (req, res) => {
    /**
     #swagger.tags = ["Bookings"]
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

    const result = await getBookingsService(req.auth_user, req.user_role, page, limit)
    return {
        statusCode: 200,
        message: 'Bookings retrieved successfully',
        data: result.data,
        pagination: result.pagination,
    }
})

export const getBookingHandler = asyncWrapper(async (req, res) => {
    /**
     #swagger.tags = ["Bookings"]
     #swagger.security = [{ "bearerAuth": [] }]
     #swagger.parameters['id'] = {
        in: 'path',
        schema: { type: 'string' }
     }
     */
    const booking = await getBookingByIdService(req.params.id, req.auth_user)
    return {
        statusCode: 200,
        message: 'Booking retrieved successfully',
        data: booking,
    }
})

export const updateBookingHandler = asyncWrapper(async (req, res) => {
    /**
     #swagger.tags = ["Bookings"]
     #swagger.security = [{ "bearerAuth": [] }]
     #swagger.parameters['id'] = {
        in: 'path',
        schema: { type: 'string' }
     }
     #swagger.requestBody = {
        required: true,
        schema: { $ref: "#/components/schemas/updateBooking" }
     }
     */
    const booking = await updateBookingService(req.params.id, req.auth_user, req.body)
    return {
        statusCode: 200,
        message: 'Booking updated successfully',
        data: booking,
    }
})

export const deleteBookingHandler = asyncWrapper(async (req, res) => {
    /**
     #swagger.tags = ["Bookings"]
     #swagger.security = [{ "bearerAuth": [] }]
     #swagger.parameters['id'] = {
        in: 'path',
        schema: { type: 'string' }
     }
     */
    await deleteBookingService(req.params.id, req.auth_user)
    return {
        statusCode: 200,
        message: 'Booking deleted successfully',
        data: null,
    }
})

export const updateBookingStatusHandler = asyncWrapper(async (req, res) => {
    /**
     #swagger.tags = ["Bookings"]
     #swagger.security = [{ "bearerAuth": [] }]
     #swagger.parameters['id'] = {
        in: 'path',
        schema: { type: 'string' }
     }
     #swagger.requestBody = {
        required: true,
        schema: {
            type: 'object',
            properties: {
                status: { type: 'string', enum: ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'] }
            }
        }
     }
     */
    const booking = await updateBookingStatusService(req.params.id, req.auth_user, req.body.status as BookingStatus)
    return {
        statusCode: 200,
        message: 'Booking status updated successfully',
        data: booking,
    }
})
