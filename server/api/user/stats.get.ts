export default defineEventHandler(async (event) => {
    const session = await requireUserSession(event)
    const userId = session.user?.id || session.secure?.id

    if (!userId) {
        throw createError({
            message: 'Usuario no autenticado',
            statusCode: 401,
        })
    }

    const userData = await prisma.user.findUnique({
        include: {
            conversations: {
                include: {
                    conversationAttachments: {
                        select: {
                            createdAt: true,
                            id: true,
                            size: true,
                        },
                    },
                },
                select: {
                    createdAt: true,
                    id: true,
                },
            },
        },
        where: { id: userId },
    })

    if (!userData) {
        throw createError({
            message: 'Usuario no encontrado',
            statusCode: 404,
        })
    }

    // Calculate conversations stats
    const totalConversations = userData.conversations.length
    const conversationsThisMonth = userData.conversations.filter((conv) => {
        const convDate = new Date(conv.createdAt)
        const now = new Date()
        return convDate.getMonth() === now.getMonth() && convDate.getFullYear() === now.getFullYear()
    }).length

    // Calculate storage used
    const totalStorage = userData.conversations.flatMap((conv) => conv.conversationAttachments).reduce((acc, att) => acc + (att.size || 0), 0)
    const storageInMB = (totalStorage / (1024 * 1024)).toFixed(2)

    // Get messages count
    const messagesCount = await prisma.conversationMessage.count({
        where: {
            conversation: {
                userId,
            },
        },
    })

    return {
        stats: {
            accountAge: Math.floor((Date.now() - new Date(userData.createdAt).getTime()) / (1000 * 60 * 60 * 24)),
            conversationsThisMonth,
            storageUsed: storageInMB,
            totalConversations,
            totalFiles: userData.conversations.flatMap((conv) => conv.conversationAttachments).length,
            totalMessages: messagesCount,
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
