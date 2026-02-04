export interface IReturnResponse {
    statusCode?: number
    data?: any | null
    message?: string
    pagination?: {
        page: number
        limit: number
        totalPages: number
        totalItems: number
    }
}

export interface IPageParams {
    paginateRecords: { skip: number; take: number }
    pagination: IReturnResponse['pagination']
}
