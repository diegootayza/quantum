import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Seeding credit packages...')

    // Verificar si ya existen paquetes
    const existingPackages = await prisma.creditPackage.count()

    if (existingPackages > 0) {
        console.log('⚠️  Credit packages already exist. Skipping seed.')
        return
    }

    // Crear paquete básico: 1000 créditos = $10
    const basicPackage = await prisma.creditPackage.create({
        data: {
            name: 'Paquete Básico',
            description: '1000 créditos para generar 10 videos',
            credits: 1000,
            price: 10,
            currency: 'USD',
            bonusCredits: 0,
            active: true,
        },
    })

    // Crear paquete popular: 3000 créditos = $25 (ahorro de $5)
    const popularPackage = await prisma.creditPackage.create({
        data: {
            name: 'Paquete Popular',
            description: '3000 créditos + 300 bonus para generar 33 videos',
            credits: 3000,
            price: 25,
            currency: 'USD',
            bonusCredits: 300,
            active: true,
        },
    })

    // Crear paquete premium: 10000 créditos = $75 (ahorro de $25)
    const premiumPackage = await prisma.creditPackage.create({
        data: {
            name: 'Paquete Premium',
            description: '10000 créditos + 2000 bonus para generar 120 videos',
            credits: 10000,
            price: 75,
            currency: 'USD',
            bonusCredits: 2000,
            active: true,
        },
    })

    console.log('✅ Credit packages created:')
    console.log('  - Basic:', basicPackage.name, `(${basicPackage.credits} credits for $${basicPackage.price})`)
    console.log(
        '  - Popular:',
        popularPackage.name,
        `(${popularPackage.credits + popularPackage.bonusCredits} credits for $${popularPackage.price})`,
    )
    console.log(
        '  - Premium:',
        premiumPackage.name,
        `(${premiumPackage.credits + premiumPackage.bonusCredits} credits for $${premiumPackage.price})`,
    )
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
