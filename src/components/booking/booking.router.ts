import {
    createBookingHandler,
    getBookingsHandler,
    getBookingHandler,
    updateBookingHandler,
    deleteBookingHandler,
    updateBookingStatusHandler,
} from './booking.controller'
import { bookingValidator, createBookingSchema, updateBookingSchema } from './booking.validator'
import { authGuard } from '@/middlewares/auth.middleware'
import { Router } from 'express'

const bookingRouter = Router()

bookingRouter
    .post('/bookings', authGuard, bookingValidator(createBookingSchema), createBookingHandler)
    .get('/bookings', authGuard, getBookingsHandler)
    .get('/bookings/:id', authGuard, getBookingHandler)
    .put('/bookings/:id', authGuard, bookingValidator(updateBookingSchema), updateBookingHandler)
    .patch('/bookings/:id/status', authGuard, updateBookingStatusHandler)
    .delete('/bookings/:id', authGuard, deleteBookingHandler)

export default bookingRouter
