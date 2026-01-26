import { z } from 'zod'

const schema = z.object({
    email: z.email('Correo electrónico inválido'),
    password: z.string().min(8, 'Debe tener al menos 8 caracteres'),
})

export default defineEventHandler(async (event) => {
    const result = await readValidatedBody(event, schema.parse)

    const user = await prisma.user.findUnique({ where: { email: result.email } })

    if (!user) throw createError({ statusCode: 401, statusMessage: 'Usuario no encontrado' })

    const isPasswordValid = await verifyPassword(user.password, result.password)

    if (!isPasswordValid) throw createError({ statusCode: 401, statusMessage: 'Contraseña incorrecta' })

    // Generar refresh token
    const refreshToken = crypto.randomUUID()
    const tokenExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 días

    // Guardar refresh token en la base de datos
    await prisma.user.update({
        data: {
            refreshToken,
            tokenExpiry,
        },
        where: { id: user.id },
    })

    await setUserSession(event, {
        secure: {
            id: user.id,
            role: user.role,
        },
        user: {
            active: user.active,
            email: user.email,
            id: user.id,
            name: user.name,
            role: user.role,
            surname: user.surname,
        },
    })

    return {
        message: 'Usuario autenticado exitosamente',
        refreshToken,
    }
})
