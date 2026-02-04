import asyncWrapper from '@/utils/asyncWrapper'
import { uploadFileService } from './file.service'

export const noteUploadHandler = asyncWrapper(async (req) => {
    /**
    #swagger.tags = ['File']
    #swagger.consumes = ['multipart/form-data']

    #swagger.requestBody = {
        content: {
            'multipart/form-data': {
                schema: {
                    type: 'object',
                    properties: {
                        files: {
                            type: 'array',
                            items: {
                                type: 'string',
                                    format: 'binary',
                                    description: 'Media files to upload',
                                },
                                description: 'Array of media files to upload',
                            },
                            file_type: {
                                type: 'string',
                                enum: ['IMAGE', 'AUDIO', 'DOC'],
                                description: 'Type of the files being uploaded',
                            },
                        },
                        required: ['files', 'file_type'],
                    },
                },
            },
        }
    */
    if (!req.files) {
        return { message: 'no file uploaded' }
    }
    const data = await uploadFileService(req.body, req.files, req.auth_user)
    return { data: data }
})
