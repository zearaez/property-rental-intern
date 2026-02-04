import prisma from '@/utils/query'

export const trackBrowsingHistoryService = async (
    propertyId: string,
    userId?: string
): Promise<void> => {
    // Verify property exists
    const property = await prisma.properties.findUnique({
        where: {
            id: propertyId,
            deleted_at: null,
        },
    })

    if (!property) {
        return // Don't throw error, just skip tracking if property doesn't exist
    }

    // Create browsing history entry
    await prisma.browsing_history.create({
        data: {
            property_id: propertyId,
            user_id: userId || null,
            viewed_at: new Date(),
        },
    })
}

export const getBrowsingHistoryService = async (
    userId: string,
    page: number = 1,
    limit: number = 10
): Promise<any> => {
    const skip = (page - 1) * limit

    const [history, total] = await Promise.all([
        prisma.browsing_history.findMany({
            where: {
                user_id: userId,
            },
            select: {
                id: true,
                viewed_at: true,
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
                                latitude: true,
                                longitude: true,
                            },
                        },
                        property_images: {
                            select: {
                                id: true,
                                url: true,
                            },
                        },
                    },
                },
            },
            skip,
            take: limit,
            orderBy: {
                viewed_at: 'desc',
            },
        }),
        prisma.browsing_history.count({
            where: {
                user_id: userId,
            },
        }),
    ])

    return {
        data: history,
        pagination: {
            page,
            limit,
            totalItems: total,
            totalPages: Math.ceil(total / limit),
        },
    }
}

export const clearBrowsingHistoryService = async (userId: string): Promise<void> => {
    await prisma.browsing_history.deleteMany({
        where: {
            user_id: userId,
        },
    })
}
