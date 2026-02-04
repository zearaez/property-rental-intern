import multer from 'multer'
import { ApiError } from '@/errors/apiErrors'
import { Request, Response, NextFunction } from 'express'

const AUDIO_LIMIT = 25 * 1000 * 1000
const DOC_LIMIT = 10 * 1000 * 1000
const IMAGE_LIMIT = 3 * 1000 * 1000

const storage = multer.memoryStorage()

const limits = {
    AUDIO: AUDIO_LIMIT,
    DOC: DOC_LIMIT,
    IMAGE: IMAGE_LIMIT,
}

const imageMime = [
    'image/jpeg',
    'image/png',
    'image/heic',
    'image/heif',
    'image/webp',
    'image/svg+xml',
]
const audioMime = ['audio/mpeg', 'audio/wav', 'audio/x-caf', 'audio/mp4', 'audio/amr']
const docsMime = ['text/csv']

export const upload = multer({
    storage: storage,
    fileFilter: (_, file, cb) => {
        const allowedMimetypes = [...imageMime, ...audioMime, ...docsMime]

        if (allowedMimetypes.includes(file.mimetype)) {
            cb(null, true)
        } else {
            cb(new ApiError(400, 'Invalid file type'))
        }
    },
    limits: {
        fileSize: Math.max(AUDIO_LIMIT, IMAGE_LIMIT, DOC_LIMIT),
    },
})

export const checkFileSize = (req: Request, _: Response, next: NextFunction) => {
    const files: { [key: string]: Express.Multer.File[] } | Express.Multer.File[] = req.files
    for (const [_, file] of Object.values(files).entries()) {
        if (imageMime.includes(file.mimetype) && file.size > limits.IMAGE)
            throw new ApiError(
                400,
                `Image size must be lessthan ${limits.AUDIO / (1000 * 1000)} mb`
            )

        if (audioMime.includes(file.mimetype) && file.size > limits.AUDIO)
            throw new ApiError(400, `Audio size must be lessthan ${limits.AUDIO / (1000 * 1000)}mb`)

        if (docsMime.includes(file.mimetype) && file.size > limits.DOC)
            throw new ApiError(400, `Doc size must be lessthan ${limits.DOC / (1000 * 1000)}mb`)
    }

    next()
}
