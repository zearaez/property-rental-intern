import prisma from '@/utils/query'
import { ApiError } from '@/errors/apiErrors'
import { PaymentStatus, PaymentMethod, BookingStatus } from '@prisma/client'

const COMMISSION_RATE = 0.1 // 10% platform commission

const paymentDTO = {
    id: true,
    booking_id: true,
    guest_id: true,
    host_id: true,
    amount: true,
    commission: true,
    method: true,
    status: true,
    created_at: true,
    updated_at: true,
    booking: {
        select: {
            id: true,
            start_date: true,
            end_date: true,
            status: true,
            property: {
                select: {
                    id: true,
                    title: true,
                    price: true,
                },
            },
        },
    },
}

// Calculate payment details
const calculatePaymentDetails = (amount: number) => {
    const commission = amount * COMMISSION_RATE
    const hostAmount = amount - commission

    return {
        amount,
        commission,
        hostAmount,
    }
}

export const createStripePaymentIntentService = async (
    bookingId: string,
    guestId: string
): Promise<any> => {
    // Verify booking exists and belongs to guest
    const booking = await prisma.bookings.findUnique({
        where: { id: bookingId },
        include: {
            property: true,
        },
    })

    if (!booking) {
        throw new ApiError(404, 'Booking not found')
    }

    if (booking.guest_id !== guestId) {
        throw new ApiError(403, 'You do not have permission to pay for this booking')
    }

    if (booking.status !== BookingStatus.PENDING) {
        throw new ApiError(400, 'Booking is not in PENDING status')
    }

    // Check if payment already exists
    const existingPayment = await prisma.payments.findUnique({
        where: { booking_id: bookingId },
    })

    if (existingPayment) {
        throw new ApiError(400, 'Payment already exists for this booking')
    }

    // Calculate amount based on property price and nights
    const nights = Math.ceil(
        (booking.end_date.getTime() - booking.start_date.getTime()) / (1000 * 60 * 60 * 24)
    )
    const amount = booking.property.price * nights * 100 // Convert to cents for Stripe

    const { commission } = calculatePaymentDetails(amount / 100)

    // Create payment record
    const payment = await prisma.payments.create({
        data: {
            booking_id: bookingId,
            guest_id: guestId,
            host_id: booking.property.host_id,
            amount: amount / 100,
            commission,
            method: PaymentMethod.STRIPE,
            status: PaymentStatus.PENDING,
        },
        select: paymentDTO,
    })

    // TODO: Create Stripe payment intent
    // const intent = await stripe.paymentIntents.create({...})
    // Return intent details to frontend

    return {
        payment,
        stripeDetails: {
            clientSecret: 'pk_test_...', // TODO: Replace with actual Stripe client secret
            amount: Math.round(amount),
            currency: 'usd',
        },
    }
}

export const confirmStripePaymentService = async (
    bookingId: string,
    paymentIntentId: string,
    guestId: string
): Promise<any> => {
    // Verify payment exists
    const payment = await prisma.payments.findUnique({
        where: { booking_id: bookingId },
    })

    if (!payment) {
        throw new ApiError(404, 'Payment not found')
    }

    if (payment.guest_id !== guestId) {
        throw new ApiError(403, 'You do not have permission to confirm this payment')
    }

    // TODO: Verify payment with Stripe API
    // const intent = await stripe.paymentIntents.retrieve(paymentIntentId)
    // if (intent.status !== 'succeeded') throw error

    // Update payment status
    const updatedPayment = await prisma.$transaction(async (txn) => {
        const updated = await txn.payments.update({
            where: { id: payment.id },
            data: { status: PaymentStatus.SUCCESS },
            select: paymentDTO,
        })

        // Update booking status to CONFIRMED
        await txn.bookings.update({
            where: { id: bookingId },
            data: { status: BookingStatus.CONFIRMED },
        })

        return updated
    })

    return updatedPayment
}

export const initiateKhaltiPaymentService = async (
    bookingId: string,
    guestId: string
): Promise<any> => {
    // Verify booking exists and belongs to guest
    const booking = await prisma.bookings.findUnique({
        where: { id: bookingId },
        include: {
            property: true,
        },
    })

    if (!booking) {
        throw new ApiError(404, 'Booking not found')
    }

    if (booking.guest_id !== guestId) {
        throw new ApiError(403, 'You do not have permission to pay for this booking')
    }

    if (booking.status !== BookingStatus.PENDING) {
        throw new ApiError(400, 'Booking is not in PENDING status')
    }

    // Check if payment already exists
    const existingPayment = await prisma.payments.findUnique({
        where: { booking_id: bookingId },
    })

    if (existingPayment) {
        throw new ApiError(400, 'Payment already exists for this booking')
    }

    // Calculate amount
    const nights = Math.ceil(
        (booking.end_date.getTime() - booking.start_date.getTime()) / (1000 * 60 * 60 * 24)
    )
    const amount = booking.property.price * nights

    const { commission } = calculatePaymentDetails(amount)

    // Create payment record
    const payment = await prisma.payments.create({
        data: {
            booking_id: bookingId,
            guest_id: guestId,
            host_id: booking.property.host_id,
            amount,
            commission,
            method: PaymentMethod.KHALTI,
            status: PaymentStatus.PENDING,
        },
        select: paymentDTO,
    })

    // TODO: Initiate Khalti payment
    // const khaltiResponse = await khalti.initiate({...})
    // Return payment URL to frontend

    return {
        payment,
        khaltiDetails: {
            paymentUrl: 'https://khalti.com/...',  // TODO: Replace with actual Khalti URL
            amount: Math.round(amount * 100), // Convert to paisa
            currency: 'NPR',
        },
    }
}

export const verifyKhaltiPaymentService = async (
    bookingId: string,
    transactionId: string,
    guestId: string
): Promise<any> => {
    // Verify payment exists
    const payment = await prisma.payments.findUnique({
        where: { booking_id: bookingId },
    })

    if (!payment) {
        throw new ApiError(404, 'Payment not found')
    }

    if (payment.guest_id !== guestId) {
        throw new ApiError(403, 'You do not have permission to verify this payment')
    }

    // TODO: Verify transaction with Khalti API
    // const khaltiStatus = await khalti.verify({...})
    // if (!khaltiStatus.success) throw error

    // Update payment status
    const updatedPayment = await prisma.$transaction(async (txn) => {
        const updated = await txn.payments.update({
            where: { id: payment.id },
            data: { status: PaymentStatus.SUCCESS },
            select: paymentDTO,
        })

        // Update booking status to CONFIRMED
        await txn.bookings.update({
            where: { id: bookingId },
            data: { status: BookingStatus.CONFIRMED },
        })

        return updated
    })

    return updatedPayment
}

export const getPaymentService = async (
    paymentId: string,
    userId: string
): Promise<any> => {
    const payment = await prisma.payments.findUnique({
        where: { id: paymentId },
        select: paymentDTO,
    })

    if (!payment) {
        throw new ApiError(404, 'Payment not found')
    }

    // Verify user is guest or host
    if (payment.guest_id !== userId && payment.host_id !== userId) {
        throw new ApiError(403, 'You do not have permission to view this payment')
    }

    return payment
}

export const getPaymentsByBookingService = async (
    bookingId: string,
    userId: string
): Promise<any> => {
    const booking = await prisma.bookings.findUnique({
        where: { id: bookingId },
        include: { property: true },
    })

    if (!booking) {
        throw new ApiError(404, 'Booking not found')
    }

    // Verify user is guest or host
    if (booking.guest_id !== userId && booking.property.host_id !== userId) {
        throw new ApiError(403, 'You do not have permission to view this booking')
    }

    const payment = await prisma.payments.findUnique({
        where: { booking_id: bookingId },
        select: paymentDTO,
    })

    return payment
}
