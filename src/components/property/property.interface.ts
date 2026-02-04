export interface ICreateProperty {
    title: string
    description: string
    price: number
    type: string
    status?: string
    location: {
        address: string
        city: string
        latitude: number
        longitude: number
    }
}

export interface IUpdateProperty {
    title?: string
    description?: string
    price?: number
    type?: string
    status?: string
    location?: {
        address: string
        city: string
        latitude: number
        longitude: number
    }
}

export interface IPropertyQuery {
    city?: string
    type?: string
    minPrice?: number
    maxPrice?: number
    status?: string
    sortBy?: string
    order?: 'asc' | 'desc'
    page?: number
    limit?: number
}
