export const propertySchema = {
    createProperty: {
        title: 'string',
        description: 'string',
        price: 'number',
        type: 'string',
        status: {
            type: 'string',
            enum: ['AVAILABLE', 'RENTED'],
        },
        location: {
            address: 'string',
            city: 'string',
            latitude: 'number',
            longitude: 'number',
        },
    },
    updateProperty: {
        title: 'string',
        description: 'string',
        price: 'number',
        type: 'string',
        status: {
            type: 'string',
            enum: ['AVAILABLE', 'RENTED'],
        },
        location: {
            address: 'string',
            city: 'string',
            latitude: 'number',
            longitude: 'number',
        },
    },
}
