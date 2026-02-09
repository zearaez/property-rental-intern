import { config } from '@/config/config'
import { PrismaClient, UserRole, PropertyStatus, BookingStatus, PaymentStatus, PaymentMethod, AuditAction } from '@prisma/client'
import type { users as User } from '@prisma/client'

declare global {
    var prisma: PrismaClient | undefined
}

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
