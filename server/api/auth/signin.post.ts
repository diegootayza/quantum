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

    await setUserSession(event, {
        secure: {
            id: user.id,
            role: user.role,
        },
        user: {
            id: user.id,
            active: user.active,
            email: user.email,
            name: user.name,
            role: user.role,
            surname: user.surname,
        },
    })

    return { message: 'Usuario autenticado exitosamente' }
})
