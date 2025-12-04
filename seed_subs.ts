
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    // Create Services
    const serviceAI = await prisma.service.create({
        data: {
            name: 'AI Assistant',
            description: 'Access to advanced AI models',
            active: true,
        },
    })

    const serviceStorage = await prisma.service.create({
        data: {
            name: 'Cloud Storage',
            description: '1TB of secure cloud storage',
            active: true,
        },
    })

    // Create Subscriptions
    await prisma.subscription.create({
        data: {
            name: 'Basic Plan',
            description: 'Essential features for individuals',
            price: 9.99,
            currency: 'USD',
            interval: 'MONTHLY',
            active: true,
            features: ['Basic Support', 'Community Access'],
            services: {
                connect: [{ id: serviceAI.id }],
            },
        },
    })

    await prisma.subscription.create({
        data: {
            name: 'Pro Plan',
            description: 'Advanced features for professionals',
            price: 29.99,
            currency: 'USD',
            interval: 'MONTHLY',
            active: true,
            features: ['Priority Support', 'Community Access', 'Advanced Analytics'],
            services: {
                connect: [{ id: serviceAI.id }, { id: serviceStorage.id }],
            },
        },
    })

    console.log('Database seeded successfully')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
