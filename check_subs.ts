
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const subscriptions = await prisma.subscription.findMany()
    console.log('Subscriptions:', JSON.stringify(subscriptions, null, 2))
}

main()
    .catch((e) => {
        throw e
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
