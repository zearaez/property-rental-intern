import { PrismaClient, UserRole, PropertyStatus, BookingStatus, PaymentStatus, PaymentMethod, AuditAction } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Starting database seeding...')

    // Clear existing data (optional - comment out if you want to keep existing data)
    console.log('📝 Clearing existing data...')
    await prisma.audit_logs.deleteMany()
    await prisma.payments.deleteMany()
    await prisma.bookings.deleteMany()
    await prisma.inquiries.deleteMany()
    await prisma.browsing_history.deleteMany()
    await prisma.favorites.deleteMany()
    await prisma.property_images.deleteMany()
    await prisma.locations.deleteMany()
    await prisma.properties.deleteMany()
    await prisma.users.deleteMany()

    // Seed users
    console.log('👥 Creating users...')
    const host1 = await prisma.users.create({
        data: {
            username: 'johnsmith',
            name: 'John Smith',
            email: 'john.smith@example.com',
            password: bcrypt.hashSync('password123', 10),
            role: UserRole.HOST,
            phone: '+1234567890',
        },
    })

    const host2 = await prisma.users.create({
        data: {
            username: 'sarahjohnson',
            name: 'Sarah Johnson',
            email: 'sarah.johnson@example.com',
            password: bcrypt.hashSync('password123', 10),
            role: UserRole.HOST,
            phone: '+1234567891',
        },
    })

    const guest1 = await prisma.users.create({
        data: {
            username: 'alicebrown',
            name: 'Alice Brown',
            email: 'alice.brown@example.com',
            password: bcrypt.hashSync('password123', 10),
            role: UserRole.GUEST,
            phone: '+1234567892',
        },
    })

    const guest2 = await prisma.users.create({
        data: {
            username: 'bobwilson',
            name: 'Bob Wilson',
            email: 'bob.wilson@example.com',
            password: bcrypt.hashSync('password123', 10),
            role: UserRole.GUEST,
            phone: '+1234567893',
        },
    })

    const guest3 = await prisma.users.create({
        data: {
            username: 'caroldavis',
            name: 'Carol Davis',
            email: 'carol.davis@example.com',
            password: bcrypt.hashSync('password123', 10),
            role: UserRole.GUEST,
            phone: '+1234567894',
        },
    })

    // Seed properties
    console.log('🏠 Creating properties...')
    const prop1 = await prisma.properties.create({
        data: {
            title: 'Modern Downtown Loft',
            description: 'Beautiful modern loft in the heart of downtown with stunning city views. Fully equipped with modern amenities.',
            price: 150,
            type: 'APARTMENT',
            status: PropertyStatus.AVAILABLE,
            host_id: host1.id,
            locations: {
                create: {
                    address: '123 Main Street, Apt 4B',
                    city: 'New York',
                    latitude: 40.7128,
                    longitude: -74.006,
                },
            },
            property_images: {
                create: [
                    { url: 'https://example.com/prop1-img1.jpg' },
                    { url: 'https://example.com/prop1-img2.jpg' },
                ],
            },
        },
    })

    const prop2 = await prisma.properties.create({
        data: {
            title: 'Cozy Beach House',
            description: 'Charming beachfront house with direct beach access. Perfect for a relaxing vacation.',
            price: 200,
            type: 'HOUSE',
            status: PropertyStatus.AVAILABLE,
            host_id: host1.id,
            locations: {
                create: {
                    address: '456 Ocean Avenue',
                    city: 'Miami',
                    latitude: 25.7617,
                    longitude: -80.1918,
                },
            },
            property_images: {
                create: [
                    { url: 'https://example.com/prop2-img1.jpg' },
                ],
            },
        },
    })

    const prop3 = await prisma.properties.create({
        data: {
            title: 'Mountain Villa',
            description: 'Spacious villa with panoramic mountain views. Ideal for family getaways.',
            price: 250,
            type: 'VILLA',
            status: PropertyStatus.AVAILABLE,
            host_id: host2.id,
            locations: {
                create: {
                    address: '789 Peak Road',
                    city: 'Denver',
                    latitude: 39.7392,
                    longitude: -104.9903,
                },
            },
            property_images: {
                create: [
                    { url: 'https://example.com/prop3-img1.jpg' },
                    { url: 'https://example.com/prop3-img2.jpg' },
                    { url: 'https://example.com/prop3-img3.jpg' },
                ],
            },
        },
    })

    const prop4 = await prisma.properties.create({
        data: {
            title: 'Studio in Historic District',
            description: 'Charming studio apartment in a historic building with character and vintage charm.',
            price: 100,
            type: 'STUDIO',
            status: PropertyStatus.AVAILABLE,
            host_id: host2.id,
            locations: {
                create: {
                    address: '321 Heritage Lane',
                    city: 'Boston',
                    latitude: 42.3601,
                    longitude: -71.0589,
                },
            },
            property_images: {
                create: [
                    { url: 'https://example.com/prop4-img1.jpg' },
                ],
            },
        },
    })

    // Seed favorites
    console.log('❤️ Creating favorites...')
    await prisma.favorites.createMany({
        data: [
            { user_id: guest1.id, property_id: prop1.id },
            { user_id: guest1.id, property_id: prop2.id },
            { user_id: guest2.id, property_id: prop3.id },
            { user_id: guest3.id, property_id: prop4.id },
        ],
    })

    // Seed browsing history
    console.log('📖 Creating browsing history...')
    await prisma.browsing_history.createMany({
        data: [
            { user_id: guest1.id, property_id: prop1.id, viewed_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
            { user_id: guest1.id, property_id: prop2.id, viewed_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) },
            { user_id: guest2.id, property_id: prop3.id, viewed_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
            { user_id: guest3.id, property_id: prop4.id, viewed_at: new Date() },
        ],
    })

    // Seed inquiries
    console.log('💬 Creating inquiries...')
    await prisma.inquiries.createMany({
        data: [
            {
                message: 'Hi, is this property available for next month?',
                guest_id: guest1.id,
                host_id: host1.id,
                property_id: prop1.id,
            },
            {
                message: 'Can you provide more information about amenities?',
                guest_id: guest2.id,
                host_id: host2.id,
                property_id: prop3.id,
            },
        ],
    })

    // Seed bookings
    console.log('📅 Creating bookings...')
    const startDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
    const endDate = new Date(startDate.getTime() + 5 * 24 * 60 * 60 * 1000) // 5 days later

    const booking1 = await prisma.bookings.create({
        data: {
            guest_id: guest1.id,
            property_id: prop1.id,
            start_date: startDate,
            end_date: endDate,
            status: BookingStatus.CONFIRMED,
        },
    })

    await prisma.bookings.create({
        data: {
            guest_id: guest2.id,
            property_id: prop2.id,
            start_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
            end_date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
            status: BookingStatus.PENDING,
        },
    })

    // Seed payments
    console.log('💳 Creating payments...')
    await prisma.payments.create({
        data: {
            booking_id: booking1.id,
            guest_id: guest1.id,
            host_id: host1.id,
            amount: 750, // 5 nights * $150/night
            commission: 75, // 10% commission
            method: PaymentMethod.STRIPE,
            status: PaymentStatus.SUCCESS,
        },
    })

    // Seed audit logs
    console.log('📋 Creating audit logs...')
    await prisma.audit_logs.createMany({
        data: [
            {
                entity: 'properties',
                entity_id: prop1.id,
                action: AuditAction.CREATE,
                user_id: host1.id,
                old_data: {},
                new_data: { title: prop1.title },
                ip_address: '127.0.0.1',
                user_agent: 'Seeder',
            },
            {
                entity: 'bookings',
                entity_id: booking1.id,
                action: AuditAction.CREATE,
                user_id: guest1.id,
                old_data: {},
                new_data: { status: BookingStatus.CONFIRMED },
                ip_address: '127.0.0.1',
                user_agent: 'Seeder',
            },
            {
                entity: 'payments',
                entity_id: booking1.id,
                action: AuditAction.PAYMENT_SUCCESS,
                user_id: guest1.id,
                old_data: { status: 'PENDING' },
                new_data: { status: 'SUCCESS' },
                ip_address: '127.0.0.1',
                user_agent: 'Seeder',
            },
        ],
    })

    console.log('✅ Database seeding completed successfully!')
    console.log('\n📊 Seeding Summary:')
    console.log(`  • Users: 5 (2 Hosts, 3 Guests)`)
    console.log(`  • Properties: 4`)
    console.log(`  • Favorites: 4`)
    console.log(`  • Browsing History: 4`)
    console.log(`  • Inquiries: 2`)
    console.log(`  • Bookings: 2`)
    console.log(`  • Payments: 1`)
    console.log(`  • Audit Logs: 3`)
    console.log('\n🔑 Test Credentials:')
    console.log(`  • Host 1: john.smith@example.com / password123`)
    console.log(`  • Host 2: sarah.johnson@example.com / password123`)
    console.log(`  • Guest 1: alice.brown@example.com / password123`)
    console.log(`  • Guest 2: bob.wilson@example.com / password123`)
    console.log(`  • Guest 3: carol.davis@example.com / password123`)
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error('❌ Seeding failed:', e)
        await prisma.$disconnect()
        process.exit(1)
    })
