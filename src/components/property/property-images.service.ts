import prisma from '@/utils/query'
import { ApiError } from '@/errors/apiErrors'

export const uploadPropertyImagesService = async (
    propertyId: string,
    hostId: string,
    files: Express.Multer.File[]
): Promise<any> => {
    // Verify property exists and user is owner
    const property = await prisma.properties.findUnique({
        where: {
            id: propertyId,
        },
    })

    if (!property) {
        throw new ApiError(404, 'Property not found')
    }

    if (property.host_id !== hostId) {
        throw new ApiError(403, 'You do not have permission to upload images for this property')
    }

    if (!files || files.length === 0) {
        throw new ApiError(400, 'No files provided')
    }

    // Upload files to storage (placeholder - implement with your storage service)
    const uploadedImages = await Promise.all(
        files.map(async (file) => {
            // TODO: Implement actual file upload to cloud storage (S3, CloudinaryCD, etc)
            // For now, using placeholder URLs
            const url = `https://example.com/properties/${propertyId}/images/${Date.now()}-${file.originalname}`

            return prisma.property_images.create({
                data: {
                    url,
                    property_id: propertyId,
                },
                select: {
                    id: true,
                    url: true,
                },
            })
        })
    )

    return uploadedImages
}

export const getPropertyImagesService = async (propertyId: string): Promise<any> => {
    // Verify property exists
    const property = await prisma.properties.findUnique({
        where: {
            id: propertyId,
        },
    })

    if (!property) {
        throw new ApiError(404, 'Property not found')
    }

    const images = await prisma.property_images.findMany({
        where: {
            property_id: propertyId,
        },
        select: {
            id: true,
            url: true,
        },
    })

    return images
}

export const deletePropertyImageService = async (
    propertyId: string,
    imageId: string,
    hostId: string
): Promise<void> => {
    // Verify property exists and user is owner
    const property = await prisma.properties.findUnique({
        where: {
            id: propertyId,
        },
    })

    if (!property) {
        throw new ApiError(404, 'Property not found')
    }

    if (property.host_id !== hostId) {
        throw new ApiError(403, 'You do not have permission to delete images for this property')
    }

    // Verify image exists
    const image = await prisma.property_images.findUnique({
        where: {
            id: imageId,
        },
    })

    if (!image || image.property_id !== propertyId) {
        throw new ApiError(404, 'Image not found')
    }

    await prisma.property_images.delete({
        where: {
            id: imageId,
        },
    })
}
