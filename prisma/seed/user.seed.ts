import bcrypt from 'bcryptjs'
import { ProviderEnum, RoleEnum } from '@/src/utils/query'
import prisma from '@prisma/client'

const users = [
    {
        first_name: 'Superadmin',
        last_name: 'User',
        password: bcrypt.hashSync('helloworld', 10),
        email: 'superadmin@boilerplate.com',
        provider: ProviderEnum.CREDENTIAL,
        role: RoleEnum.SUPERADMIN,
        phone: '9823232323',
        bio: 'developer',
        is_verified: true,
    },
    {
        first_name: 'Admin',
        last_name: 'User',
        password: bcrypt.hashSync('helloworld', 10),
        email: 'admin@boilerplate.com',
        provider: ProviderEnum.CREDENTIAL,
        role: RoleEnum.ADMIN,
        phone: '9823232323',
        bio: 'developer',
        is_verified: true,
    },
    {
        first_name: 'Basic',
        last_name: 'User',
        password: bcrypt.hashSync('helloworld', 10),
        email: 'basic@boilerplate.com',
        provider: ProviderEnum.CREDENTIAL,
        role: RoleEnum.BASIC,
        phone: '9823232323',
        bio: 'developer',
        is_verified: true,
    },
]

async function registerUser() {
    const users = [
        {
            first_name: 'Superadmin',
            last_name: 'User',
            password: bcrypt.hashSync('helloworld', 10),
            email: 'superadmin@boilerplate.com',
            provider: ProviderEnum.CREDENTIAL,
            role: RoleEnum.SUPERADMIN,
            phone: '9823232323',
            bio: 'developer',
            is_verified: true,
        },
        {
            first_name: 'Admin',
            last_name: 'User',
            password: bcrypt.hashSync('helloworld', 10),
            email: 'admin@boilerplate.com',
            provider: ProviderEnum.CREDENTIAL,
            role: RoleEnum.ADMIN,
            phone: '9823232323',
            bio: 'developer',
            is_verified: true,
        },
        {
            first_name: 'Basic',
            last_name: 'User',
            password: bcrypt.hashSync('helloworld', 10),
            email: 'basic@boilerplate.com',
            provider: ProviderEnum.CREDENTIAL,
            role: RoleEnum.BASIC,
            phone: '9823232323',
            bio: 'developer',
            is_verified: true,
        },
    ]

    await prisma.users.createMany({ data: [...users] })
}
