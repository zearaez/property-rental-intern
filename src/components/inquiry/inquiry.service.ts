import prisma, { UserRole } from '@/utils/query'
import { ApiError } from '@/errors/apiErrors'
import { ICreateInquiry } from './inquiry.interface'

const inquiryDTO = {
    id: true,
    message: true,
    guest_id: true,
    host_id: true,
    property_id: true,
    created_at: true,
    guest: {
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
        },
    },
    host: {
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
        },
    },
}

export const createInquiryService = async (
    payload: ICreateInquiry,
    guestId: string
): Promise<any> => {
    const { message, property_id } = payload

    // Verify property exists
    const property = await prisma.properties.findUnique({
        where: {
            id: property_id,
            deleted_at: null,
        },
    })

    if (!property) {
        throw new ApiError(404, 'Property not found')
    }

    // Can't send inquiry to own property
    if (property.host_id === guestId) {
        throw new ApiError(400, 'You cannot send inquiry to your own property')
    }

    const inquiry = await prisma.inquiries.create({
        data: {
            message,
            guest_id: guestId,
            host_id: property.host_id,
            property_id,
        },
        select: inquiryDTO,
    })

    return inquiry
}

export const getInquiriesService = async (
    userId: string,
    userRole: UserRole,
    page: number = 1,
    limit: number = 10
): Promise<any> => {
    const skip = (page - 1) * limit

    const where: any = {}

    // Filter by user role
    if (userRole === UserRole.GUEST) {
        where.guest_id = userId
    } else if (userRole === UserRole.HOST) {
        where.host_id = userId
    }

    const [inquiries, total] = await Promise.all([
        prisma.inquiries.findMany({
            where,
            select: inquiryDTO,
            skip,
            take: limit,
            orderBy: {
                created_at: 'desc',
            },
        }),
        prisma.inquiries.count({ where }),
    ])

    return {
        data: inquiries,
        pagination: {
            page,
            limit,
            totalItems: total,
            totalPages: Math.ceil(total / limit),
        },
    }
}

export const getInquiryByIdService = async (inquiryId: string, userId: string): Promise<any> => {
    const inquiry = await prisma.inquiries.findUnique({
        where: {
            id: inquiryId,
        },
        select: inquiryDTO,
    })

    if (!inquiry) {
        throw new ApiError(404, 'Inquiry not found')
    }

    // Verify user is guest or host in the inquiry
    if (inquiry.guest_id !== userId && inquiry.host_id !== userId) {
        throw new ApiError(403, 'You do not have permission to view this inquiry')
    }

    return inquiry
}
