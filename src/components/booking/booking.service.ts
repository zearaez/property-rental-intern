import prisma, { UserRole } from '@/utils/query'
import { ApiError } from '@/errors/apiErrors'
import { ICreateBooking, IUpdateBooking } from './booking.interface'
import { isBefore, startOfToday } from 'date-fns'
import { BookingStatus } from '@prisma/client'

const bookingDTO = {
    id: true,
    guest_id: true,
    property_id: true,
    start_date: true,
    end_date: true,
    status: true,
    created_at: true,
    updated_at: true,
    deleted_at: true,
    guest: {
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
        },
    },
    property: {
        select: {
            id: true,
            title: true,
            description: true,
            price: true,
            type: true,
            status: true,
            host_id: true,
            locations: {
                select: {
                    id: true,
                    address: true,
                    city: true,
                },
            },
        },
    },
    payments: true,
}

// Validate booking dates
const validateBookingDates = (startDate: Date, endDate: Date) => {
    // Check if start_date is in the future
    if (isBefore(startDate, startOfToday())) {
        throw new ApiError(400, 'Start date must be in the future')
    }

    // Check if start_date < end_date
    if (!isBefore(startDate, endDate)) {
        throw new ApiError(400, 'End date must be after start date')
    }
}

// Check for conflicting bookings
const checkConflictingBookings = async (
    propertyId: string,
    startDate: Date,
    endDate: Date,
    excludeBookingId?: string
): Promise<boolean> => {
    const where: any = {
        property_id: propertyId,
        deleted_at: null,
        status: { not: BookingStatus.CANCELLED },
        OR: [
            {
                start_date: { lte: startDate },
                end_date: { gt: startDate },
            },
            {
                start_date: { lt: endDate },
                end_date: { gte: endDate },
            },
            {
                start_date: { gte: startDate },
                end_date: { lte: endDate },
            },
        ],
    }

    if (excludeBookingId) {
        where.id = { not: excludeBookingId }
    }

    const conflictingBooking = await prisma.bookings.findFirst({ where })
    return !!conflictingBooking
}

export const createBookingService = async (
    payload: ICreateBooking,
    guestId: string
): Promise<any> => {
    const { property_id, start_date, end_date } = payload

    const startDate = new Date(start_date)
    const endDate = new Date(end_date)

    // Validate dates
    validateBookingDates(startDate, endDate)

    // Verify property exists and is available
    const property = await prisma.properties.findUnique({
        where: {
            id: property_id,
            deleted_at: null,
        },
    })

    if (!property) {
        throw new ApiError(404, 'Property not found')
    }

    if (property.status !== 'AVAILABLE') {
        throw new ApiError(400, 'Property is not available for booking')
    }

    // Can't book own property
    if (property.host_id === guestId) {
        throw new ApiError(400, 'You cannot book your own property')
    }

    // Check for conflicting bookings
    const hasConflict = await checkConflictingBookings(property_id, startDate, endDate)
    if (hasConflict) {
        throw new ApiError(400, 'Property is already booked for the selected dates')
    }

    const booking = await prisma.bookings.create({
        data: {
            guest_id: guestId,
            property_id,
            start_date: startDate,
            end_date: endDate,
            status: BookingStatus.PENDING,
        },
        select: bookingDTO,
    })

    return booking
}

export const getBookingsService = async (
    userId: string,
    userRole: UserRole,
    page: number = 1,
    limit: number = 10
): Promise<any> => {
    const skip = (page - 1) * limit

    const where: any = {
        deleted_at: null,
    }

    // Filter by user role
    if (userRole === UserRole.GUEST) {
        where.guest_id = userId
    } else if (userRole === UserRole.HOST) {
        where.property = {
            host_id: userId,
        }
    }

    const [bookings, total] = await Promise.all([
        prisma.bookings.findMany({
            where,
            select: bookingDTO,
            skip,
            take: limit,
            orderBy: {
                created_at: 'desc',
            },
        }),
        prisma.bookings.count({ where }),
    ])

    return {
        data: bookings,
        pagination: {
            page,
            limit,
            totalItems: total,
            totalPages: Math.ceil(total / limit),
        },
    }
}

export const getBookingByIdService = async (bookingId: string, userId: string): Promise<any> => {
    const booking = await prisma.bookings.findUnique({
        where: {
            id: bookingId,
        },
        select: bookingDTO,
    })

    if (!booking) {
        throw new ApiError(404, 'Booking not found')
    }

    // Verify user is guest or host
    if (booking.guest_id !== userId && booking.property.host_id !== userId) {
        throw new ApiError(403, 'You do not have permission to view this booking')
    }

    return booking
}

export const updateBookingService = async (
    bookingId: string,
    guestId: string,
    payload: IUpdateBooking
): Promise<any> => {
    const booking = await prisma.bookings.findUnique({
        where: {
            id: bookingId,
        },
    })

    if (!booking) {
        throw new ApiError(404, 'Booking not found')
    }

    if (booking.guest_id !== guestId) {
        throw new ApiError(403, 'You do not have permission to update this booking')
    }

    if (booking.status !== BookingStatus.PENDING) {
        throw new ApiError(400, 'Can only update PENDING bookings')
    }

    const startDate = payload.start_date ? new Date(payload.start_date) : booking.start_date
    const endDate = payload.end_date ? new Date(payload.end_date) : booking.end_date

    // Validate dates
    validateBookingDates(startDate, endDate)

    // Check for conflicting bookings (excluding current booking)
    const hasConflict = await checkConflictingBookings(
        booking.property_id,
        startDate,
        endDate,
        bookingId
    )
    if (hasConflict) {
        throw new ApiError(400, 'Property is already booked for the selected dates')
    }

    const updatedBooking = await prisma.bookings.update({
        where: { id: bookingId },
        data: {
            start_date: startDate,
            end_date: endDate,
        },
        select: bookingDTO,
    })

    return updatedBooking
}

export const deleteBookingService = async (bookingId: string, userId: string): Promise<void> => {
    const booking = await prisma.bookings.findUnique({
        where: {
            id: bookingId,
        },
    })

    if (!booking) {
        throw new ApiError(404, 'Booking not found')
    }

    if (booking.guest_id !== userId) {
        throw new ApiError(403, 'You do not have permission to delete this booking')
    }

    // Soft delete
    await prisma.bookings.update({
        where: { id: bookingId },
        data: {
            status: BookingStatus.CANCELLED,
            deleted_at: new Date(),
        },
    })
}

export const updateBookingStatusService = async (
    bookingId: string,
    userId: string,
    newStatus: BookingStatus
): Promise<any> => {
    const booking = await prisma.bookings.findUnique({
        where: {
            id: bookingId,
        },
        include: {
            property: true,
        },
    })

    if (!booking) {
        throw new ApiError(404, 'Booking not found')
    }

    // Only guest can confirm/cancel own booking, only host can approve
    if (booking.guest_id !== userId && booking.property.host_id !== userId) {
        throw new ApiError(403, 'You do not have permission to update this booking')
    }

    // Validate status transition
    const validTransitions: { [key in BookingStatus]?: BookingStatus[] } = {
        [BookingStatus.PENDING]: [BookingStatus.CONFIRMED, BookingStatus.CANCELLED],
        [BookingStatus.CONFIRMED]: [BookingStatus.CANCELLED, BookingStatus.COMPLETED],
        [BookingStatus.CANCELLED]: [],
        [BookingStatus.COMPLETED]: [],
    }

    if (!validTransitions[booking.status]?.includes(newStatus)) {
        throw new ApiError(400, `Cannot transition from ${booking.status} to ${newStatus}`)
    }

    const updatedBooking = await prisma.$transaction(async (txn) => {
        const updated = await txn.bookings.update({
            where: { id: bookingId },
            data: { status: newStatus },
            select: bookingDTO,
        })

        // Update property status based on booking status
        if (newStatus === BookingStatus.CONFIRMED) {
            await txn.properties.update({
                where: { id: booking.property_id },
                data: { status: 'RENTED' },
            })
        } else if (newStatus === BookingStatus.CANCELLED) {
            // Check if there are other confirmed bookings
            const otherConfirmedBookings = await txn.bookings.count({
                where: {
                    property_id: booking.property_id,
                    id: { not: bookingId },
                    status: BookingStatus.CONFIRMED,
                    deleted_at: null,
                },
            })

            if (otherConfirmedBookings === 0) {
                await txn.properties.update({
                    where: { id: booking.property_id },
                    data: { status: 'AVAILABLE' },
                })
            }
        }

        return updated
    })

    return updatedBooking
}
