export default defineEventHandler((event) => {
    return processError(async () => {
        const session = await requireUserSession(event)
        const userId = session.user?.id || session.secure?.id

        if (!userId) {
            throw createError({
                message: 'Usuario no autenticado',
                statusCode: 401,
            })
        }

        const userData = await prisma.user.findUnique({
            where: { id: userId },
        })

        if (!userData) {
            throw createError({
                message: 'Usuario no encontrado',
                statusCode: 404,
            })
        }

        return {
            stats: {
                accountAge: Math.floor((Date.now() - new Date(userData.createdAt).getTime()) / (1000 * 60 * 60 * 24)),
                conversationsThisMonth: 0,
                storageUsed: 0,
                totalConversations: 0,
                totalFiles: 0,
                totalMessages: 0,
            },
            user: {
                active: userData.active,
                createdAt: userData.createdAt,
                email: userData.email,
                name: userData.name,
                surname: userData.surname,
            },
        }
    })
})
