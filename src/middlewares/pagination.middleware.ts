import { NextFunction, Request, Response } from 'express'

export const paginationFilter = async (req: Request, res: Response, next: NextFunction) => {
    try {
        req['paginateRecords'] = { take: 0, skip: 0 }
        req['pagination'] = { page: 0, limit: 0, totalPages: 0, totalItems: 0 }
        const page = req.query?.page as string
        const limit = req.query?.limit as string
        const pageNumber = (page && parseInt(page)) || 0
        const pageLimit = (limit && parseInt(limit)) || 10
        req.paginateRecords['skip'] = Math.ceil(
            (pageNumber === 0 || pageNumber < 0 ? 0 : pageNumber - 1) * pageLimit
        )
        req.paginateRecords['take'] = pageLimit

        req.pagination['page'] =
            pageNumber === 0 || pageNumber === 1 || pageNumber < 0 ? 1 : pageNumber

        req.pagination['limit'] = pageLimit
        next()
    } catch (err) {
        next(err)
    }
}
