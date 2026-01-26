import { z } from 'zod'

const schema = z.object({
    email: z.email('Correo electrónico inválido'),
    name: z.string().min(1, 'El nombre es obligatorio'),
    password: z.string().min(8, 'Debe tener al menos 8 caracteres'),
    surname: z.string().min(1, 'El apellido es obligatorio'),
})

export default defineEventHandler(async (event) => {
    return processError(async () => {
        const data = await readValidatedBody(event, schema.parse)

        const hashedPassword = await hashPassword(data.password)

        // Generar refresh token
        const refreshToken = crypto.randomUUID()
        const tokenExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 días

        const user = await prisma.user.create({
            data: {
                email: data.email,
                name: data.name,
                password: hashedPassword,
                refreshToken,
                surname: data.surname,
                tokenExpiry,
            },
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
            message: 'Usuario creado exitosamente',
            refreshToken,
        }
    })
})
