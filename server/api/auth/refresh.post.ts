import { z } from 'zod'

const schema = z.object({
    refreshToken: z.string().min(1, 'Refresh token requerido'),
})

export default defineEventHandler((event) => {
    return processError(async () => {
        const { refreshToken } = await readValidatedBody(event, schema.parse)

        // Buscar usuario con el refresh token válido
        const user = await prisma.user.findFirst({
            where: {
                refreshToken,
                tokenExpiry: {
                    gt: new Date(), // Token aún no ha expirado
                },
            },
        })

        if (!user) {
            throw createError({
                message: 'Refresh token inválido o expirado',
                statusCode: 401,
            })
        }

        // Generar nuevo refresh token
        const newRefreshToken = crypto.randomUUID()
        const tokenExpiryDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 días

        // Actualizar refresh token en la base de datos
        await prisma.user.update({
            data: {
                refreshToken: newRefreshToken,
                tokenExpiry: tokenExpiryDate,
            },
            where: { id: user.id },
        })

        // Establecer nueva sesión de usuario
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
            message: 'Sesión renovada exitosamente',
            refreshToken: newRefreshToken,
        }
    })
})
