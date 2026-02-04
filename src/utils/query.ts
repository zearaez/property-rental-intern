import { config } from '@/config/config'
import {
    PrismaClient,
    users as User,
    UserRole,
    PropertyStatus,
    BookingStatus,
    PaymentStatus,
    PaymentMethod,
    AuditAction,
} from '@prisma/client'

interface CustomNodeJsGlobal extends Global {
    prisma?: PrismaClient
}

declare const global: CustomNodeJsGlobal

const prisma =
    global?.prisma ||
    new PrismaClient({
        log: ['info', 'error', 'warn', 'query'],
    })

if (!config('isProd')) global.prisma = prisma

//exportedTypes [Schema]
export type IUser = User
export type IPrismaClient = PrismaClient
export { UserRole, PropertyStatus, BookingStatus, PaymentStatus, PaymentMethod, AuditAction }

//exported prisma client
export default prisma
