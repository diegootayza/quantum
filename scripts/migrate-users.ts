/**
 * Script para actualizar usuarios existentes con valores por defecto
 * para los nuevos campos de generación de imágenes
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('🔄 Actualizando usuarios existentes...')

    // Obtener todos los usuarios que tienen imageGenerationResetAt como null
    const usersToUpdate = await prisma.user.findMany({
        select: {
            id: true,
            email: true,
        },
    })

    console.log(`📊 Encontrados ${usersToUpdate.length} usuarios`)

    let updated = 0
    const now = new Date()

    for (const user of usersToUpdate) {
        try {
            await prisma.user.update({
                data: {
                    imageGenerationCount: 0,
                    imageGenerationResetAt: now,
                },
                where: { id: user.id },
            })
            updated++
            console.log(`✅ Actualizado: ${user.email}`)
        } catch (error) {
            console.log(`⚠️  Ya actualizado: ${user.email}`)
        }
    }

    console.log('')
    console.log(`✅ Migración completada!`)
    console.log(`   Total usuarios: ${usersToUpdate.length}`)
    console.log(`   Actualizados: ${updated}`)
}

main()
    .catch((e) => {
        console.error('❌ Error:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
