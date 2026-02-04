import asyncWrapper from '@/utils/asyncWrapper'
import {
    changeProfilePasswordService,
    getProfileService,
    getMyLoggedDeviceService,
    manageProfileService,
    getUsersListService,
} from './user.service'

export const getUsersHandler = asyncWrapper(async (req) => {
    /**  
    #swagger.tags = ["Users > Admin"]
    #swagger.parameters['page'] = { in: 'query' }
    #swagger.parameters['limit'] = { in: 'query' }
     */
    const { paginateRecords, pagination } = req
    const { data, total } = await getUsersListService({ user_id: req.auth_user, paginateRecords })

    pagination['totalItems'] = total
    pagination['totalPages'] = Math.ceil(total / pagination.limit)
    return { data, pagination }
})

export const getProfileHandler = asyncWrapper(async (req) => {
    /**  
    #swagger.tags = ["Profile"]
     */
    const response = await getProfileService(req.auth_user)
    return { data: response }
})

export const getMyDevicesHandler = asyncWrapper(async (req) => {
    /**  
    #swagger.tags = ["Profile"]
     */
    const response = await getMyLoggedDeviceService(req.auth_user)
    return { data: response }
})

export const updateProfileHandler = asyncWrapper(async (req) => {
    /**  
    #swagger.tags = ["Profile"]
    #swagger.requestBody = {  
        required: true,  
        schema: { $ref: "#/components/schemas/updateProfile" }  
    }  
     */
    const response = await manageProfileService({
        id: req.auth_user,
        ...req.body,
    })
    return {
        data: response,
        message: 'Profile Updated Successfullly',
    }
})

export const changeProfilePasswordHandler = asyncWrapper(async (req) => {
    /**  
    #swagger.tags = ["Profile"]
    #swagger.requestBody = {  
        required: true,  
        schema: { $ref: "#/components/schemas/changePasswordProfile" }  
    }  
     */
    const response = await changeProfilePasswordService({
        userId: req.auth_user,
        ...req.body,
    })
    return {
        data: response,
        message: 'Password Updated Successfullly',
    }
})
