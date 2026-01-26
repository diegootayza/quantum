export default defineEventHandler(async (event) => {
    return processError(async () => {
        const session = await getUserSession(event)

        if (!session?.user?.id) {
            throw createError({
                statusCode: 401,
                statusMessage: 'No hay sesión activa',
            })
        }

        // Limpiar refresh token de la base de datos
        await prisma.user.update({
            data: {
                refreshToken: null,
                tokenExpiry: null,
            },
            where: { id: session.user.id },
        })

        // Limpiar la sesión
        await clearUserSession(event)

        return { message: 'Sesión cerrada exitosamente' }
    })
})
