import prisma from '@/utils/query'
import { ApiError } from '@/errors/apiErrors'

const favoriteDTO = {
    id: true,
    user_id: true,
    property_id: true,
    created_at: true,
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
}

export const addToFavoritesService = async (
    userId: string,
    propertyId: string
): Promise<any> => {
    // Verify property exists
    const property = await prisma.properties.findUnique({
        where: {
            id: propertyId,
            deleted_at: null,
        },
    })

    if (!property) {
        throw new ApiError(404, 'Property not found')
    }

    // Check if already favorited
    const existingFavorite = await prisma.favorites.findUnique({
        where: {
            user_id_property_id: {
                user_id: userId,
                property_id: propertyId,
            },
        },
    })

    if (existingFavorite) {
        throw new ApiError(400, 'Property is already in your favorites')
    }

    const favorite = await prisma.favorites.create({
        data: {
            user_id: userId,
            property_id: propertyId,
        },
        select: favoriteDTO,
    })

    return favorite
}

export const getFavoritesService = async (
    userId: string,
    page: number = 1,
    limit: number = 10
): Promise<any> => {
    const skip = (page - 1) * limit

    const [favorites, total] = await Promise.all([
        prisma.favorites.findMany({
            where: {
                user_id: userId,
            },
            select: favoriteDTO,
            skip,
            take: limit,
            orderBy: {
                created_at: 'desc',
            },
        }),
        prisma.favorites.count({
            where: {
                user_id: userId,
            },
        }),
    ])

    return {
        data: favorites,
        pagination: {
            page,
            limit,
            totalItems: total,
            totalPages: Math.ceil(total / limit),
        },
    }
}

export const removeFromFavoritesService = async (
    userId: string,
    favoriteId: string
): Promise<void> => {
    const favorite = await prisma.favorites.findUnique({
        where: {
            id: favoriteId,
        },
    })

    if (!favorite) {
        throw new ApiError(404, 'Favorite not found')
    }

    if (favorite.user_id !== userId) {
        throw new ApiError(403, 'You do not have permission to remove this favorite')
    }

    await prisma.favorites.delete({
        where: {
            id: favoriteId,
        },
    })
}

export const checkIfFavoritedService = async (userId: string, propertyId: string): Promise<boolean> => {
    const favorite = await prisma.favorites.findUnique({
        where: {
            user_id_property_id: {
                user_id: userId,
                property_id: propertyId,
            },
        },
    })

    return !!favorite
}
