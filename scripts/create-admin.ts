/**
 * Script para crear un usuario ADMIN de prueba
 */

import { PrismaClient } from '@prisma/client'
import { createHash } from 'crypto'

const prisma = new PrismaClient()

// Función simple de hash (usa la misma que tu app)
function hashPassword(password: string): string {
    return createHash('sha256').update(password).digest('hex')
}

async function main() {
    const email = 'admin@test.com'
    const password = 'admin123'

    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({
        where: { email },
    })

    if (existingUser) {
        console.log('✅ Usuario ADMIN ya existe:', email)
        console.log('   Email:', email)
        console.log('   Password: admin123')
        console.log('   Role:', existingUser.role)

        // Actualizar a ADMIN si no lo es
        if (existingUser.role !== 'ADMIN') {
            await prisma.user.update({
                data: { role: 'ADMIN' },
                where: { id: existingUser.id },
            })
            console.log('   ✅ Actualizado a rol ADMIN')
        }
        return
    }

    // Hashear password
    const hashedPassword = hashPassword(password)

    // Crear usuario ADMIN
    const user = await prisma.user.create({
        data: {
            active: true,
            email,
            name: 'Admin',
            password: hashedPassword,
            role: 'ADMIN',
            surname: 'User',
        },
    })

    console.log('✅ Usuario ADMIN creado exitosamente!')
    console.log('   Email:', email)
    console.log('   Password: admin123')
    console.log('   Role:', user.role)
    console.log('')
    console.log('🔗 Puedes iniciar sesión en: http://localhost:3000/auth/signin')
}

main()
    .catch((e) => {
        console.error('❌ Error:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
