import { z } from 'zod'

const schema = z.object({
    email: z.email('Correo electrónico inválido'),
    name: z.string().min(1, 'El nombre es obligatorio'),
    password: z.string().min(8, 'Debe tener al menos 8 caracteres'),
    surname: z.string().min(1, 'El apellido es obligatorio'),
})

export default defineEventHandler(async (event) => {
    const result = await readValidatedBody(event, (body) => schema.safeParse(body))

    if (!result.success) throw result.error.issues

    const hashedPassword = await hashPassword(result.data.password)

    const user = await prisma.user.create({
        data: {
            email: result.data.email,
            name: result.data.name,
            password: hashedPassword,
            surname: result.data.surname,
        },
    })

    await setUserSession(event, {
        secure: {
            apiToken: '1234567890',
        },
        user: {
            email: user.email,
            id: user.id,
            name: user.name,
            surname: user.surname,
        },
    })

    return { message: 'Usuario creado exitosamente' }
})
