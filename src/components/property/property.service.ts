import prisma from '@/utils/query'
import { ApiError } from '@/errors/apiErrors'
import { ICreateProperty, IUpdateProperty, IPropertyQuery } from './property.interface'
import { PropertyStatus } from '@prisma/client'

const propertyDTO = {
    id: true,
    title: true,
    description: true,
    price: true,
    type: true,
    status: true,
    host_id: true,
    created_at: true,
    updated_at: true,
    deleted_at: true,
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
}

export const createPropertyService = async (
    payload: ICreateProperty,
    hostId: string
): Promise<any> => {
    const { title, description, price, type, status, location } = payload

    const property = await prisma.$transaction(async (txn) => {
        const newProperty = await txn.properties.create({
            data: {
                title,
                description,
                price,
                type,
                status: (status as PropertyStatus) || PropertyStatus.AVAILABLE,
                host_id: hostId,
            },
            select: propertyDTO,
        })

        // Create location
        if (location) {
            await txn.locations.create({
                data: {
                    address: location.address,
                    city: location.city,
                    latitude: location.latitude,
                    longitude: location.longitude,
                    property_id: newProperty.id,
                },
            })
        }

        return newProperty
    })

    return property
}

export const getPropertiesService = async (query: IPropertyQuery) => {
    const {
        city,
        type,
        minPrice,
        maxPrice,
        status,
        sortBy = 'created_at',
        order = 'desc',
        page = 1,
        limit = 10,
    } = query

    const skip = (page - 1) * limit

    const where: any = {
        deleted_at: null,
    }

    if (city) {
        where.locations = {
            some: {
                city: {
                    contains: city,
                    mode: 'insensitive',
                },
            },
        }
    }

    if (type) {
        where.type = {
            contains: type,
            mode: 'insensitive',
        }
    }

    if (minPrice !== undefined) {
        where.price = {
            ...(where.price || {}),
            gte: minPrice,
        }
    }

    if (maxPrice !== undefined) {
        where.price = {
            ...(where.price || {}),
            lte: maxPrice,
        }
    }

    if (status) {
        where.status = status
    }

    const [properties, total] = await Promise.all([
        prisma.properties.findMany({
            where,
            select: propertyDTO,
            skip,
            take: limit,
            orderBy: {
                [sortBy]: order,
            },
        }),
        prisma.properties.count({ where }),
    ])

    return {
        data: properties,
        pagination: {
            page,
            limit,
            totalItems: total,
            totalPages: Math.ceil(total / limit),
        },
    }
}

export const getPropertyByIdService = async (propertyId: string) => {
    const property = await prisma.properties.findUnique({
        where: {
            id: propertyId,
            deleted_at: null,
        },
        select: propertyDTO,
    })

    if (!property) {
        throw new ApiError(404, 'Property not found')
    }

    return property
}

export const updatePropertyService = async (
    propertyId: string,
    hostId: string,
    payload: IUpdateProperty
): Promise<any> => {
    const property = await prisma.properties.findUnique({
        where: {
            id: propertyId,
        },
    })

    if (!property) {
        throw new ApiError(404, 'Property not found')
    }

    if (property.host_id !== hostId) {
        throw new ApiError(403, 'You do not have permission to update this property')
    }

    const { location, ...updateData } = payload

    const updatedProperty = await prisma.$transaction(async (txn) => {
        const updated = await txn.properties.update({
            where: { id: propertyId },
            data: updateData as any,
            select: propertyDTO,
        })

        // Update location if provided
        if (location) {
            await txn.locations.upsert({
                where: { property_id: propertyId },
                create: {
                    address: location.address,
                    city: location.city,
                    latitude: location.latitude,
                    longitude: location.longitude,
                    property_id: propertyId,
                },
                update: {
                    address: location.address,
                    city: location.city,
                    latitude: location.latitude,
                    longitude: location.longitude,
                },
            })
        }

        return updated
    })

    return updatedProperty
}

export const deletePropertyService = async (
    propertyId: string,
    hostId: string
): Promise<void> => {
    const property = await prisma.properties.findUnique({
        where: {
            id: propertyId,
        },
    })

    if (!property) {
        throw new ApiError(404, 'Property not found')
    }

    if (property.host_id !== hostId) {
        throw new ApiError(403, 'You do not have permission to delete this property')
    }

    await prisma.properties.update({
        where: { id: propertyId },
        data: { deleted_at: new Date() },
    })
}
