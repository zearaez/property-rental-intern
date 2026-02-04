import swaggerAutogen from 'swagger-autogen'
import { config } from './config/config'
import { schema } from './components/index'

const swaggerOptions = {
    info: {
        version: 'v1.0.0',
        title: 'Property Rental Platform API',
        description: 'A comprehensive property rental management API with authentication, property listings, bookings, payments, and audit logging',
        contact: {
            name: 'Outcode Intern',
            email: 'support@propertyrentalplatform.com',
        },
        license: {
            name: 'MIT',
        },
    },
    servers: [
        {
            url: `${config('serverURL')}/api`,
            description: 'Production Server',
        },
        {
            url: 'http://localhost:8080/api',
            description: 'Development Server',
        },
    ],
    tags: [
        {
            name: 'Authentication',
            description: 'User authentication endpoints (register, login, refresh token)',
        },
        {
            name: 'Users',
            description: 'User profile management endpoints',
        },
        {
            name: 'Properties',
            description: 'Property listing and management endpoints',
        },
        {
            name: 'Favorites',
            description: 'User favorite properties endpoints',
        },
        {
            name: 'Browsing History',
            description: 'User browsing history tracking endpoints',
        },
        {
            name: 'Inquiries',
            description: 'Guest-to-host inquiry endpoints',
        },
        {
            name: 'Bookings',
            description: 'Booking management endpoints',
        },
        {
            name: 'Payments',
            description: 'Payment processing endpoints',
        },
        {
            name: 'Audit Logs',
            description: 'System audit logging endpoints',
        },
        {
            name: 'Files',
            description: 'File upload and management endpoints',
        },
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
                description: 'Enter JWT token in format: Bearer <token>',
            },
        },

        schemas: {
            ...schema,
        },
    },
    security: [
        {
            bearerAuth: ['read', 'write'],
        },
    ],
}

const outputFile = './src/swagger_output.json'
const endpointsFiles = ['./src/routes/index.ts']

swaggerAutogen({ openapi: '3.0.0' })(outputFile, endpointsFiles, swaggerOptions)
