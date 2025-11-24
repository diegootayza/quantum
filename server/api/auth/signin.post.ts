import { z } from 'zod'

const schema = z.object({
    email: z.email('Correo electrónico inválido'),
    password: z.string().min(8, 'Debe tener al menos 8 caracteres'),
})

export default defineEventHandler(async (event) => {
    const result = await readValidatedBody(event, (body) => schema.safeParse(body))

    if (!result.success) throw result.error.issues

    const user = await prisma.user.findUnique({ where: { email: result.data.email } })

    if (!user) throw createError({ statusCode: 401, statusMessage: 'Usuario no encontrado' })

    const isPasswordValid = await verifyPassword(user.password, result.data.password)

    if (!isPasswordValid) throw createError({ statusCode: 401, statusMessage: 'Contraseña incorrecta' })

    await setUserSession(event, {
        secure: {
            apiToken: '1234567890',
        },
        user: {
            email: user.email,
            id: user.id,
            name: user.name,
            role: user.role,
            surname: user.surname,
        },
    })

    return { message: 'Usuario autenticado exitosamente' }
})
