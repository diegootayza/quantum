export default defineEventHandler(async (event) => {
    const session = await requireUserSession(event)
    const userId = session.user?.id || session.secure?.id

    if (!userId) {
        throw createError({
            statusCode: 401,
            message: 'Usuario no autenticado'
        })
    }

    // Get user with subscription and services
    const userData = await prisma.user.findUnique({
        where: { id: userId },
        include: {
            subscription: {
                include: {
                    services: true
                }
            },
            services: true,
            conversations: {
                select: {
                    id: true,
                    createdAt: true
                }
            },
            attachments: {
                select: {
                    id: true,
                    size: true
                }
            }
        }
    })

    if (!userData) {
        throw createError({
            statusCode: 404,
            message: 'Usuario no encontrado'
        })
    }

    // Calculate conversations stats
    const totalConversations = userData.conversations.length
    const conversationsThisMonth = userData.conversations.filter(conv => {
        const convDate = new Date(conv.createdAt)
        const now = new Date()
        return convDate.getMonth() === now.getMonth() &&
            convDate.getFullYear() === now.getFullYear()
    }).length

    // Calculate storage used
    const totalStorage = userData.attachments.reduce((acc, att) => acc + (att.size || 0), 0)
    const storageInMB = (totalStorage / (1024 * 1024)).toFixed(2)

    // Get messages count
    const messagesCount = await prisma.message.count({
        where: {
            conversation: {
                userId: userId
            }
        }
    })

    return {
        user: {
            name: userData.name,
            surname: userData.surname,
            email: userData.email,
            active: userData.active,
            createdAt: userData.createdAt
        },
        subscription: userData.subscription ? {
            name: userData.subscription.name,
            price: userData.subscription.price,
            currency: userData.subscription.currency,
            interval: userData.subscription.interval,
            services: userData.subscription.services
        } : null,
        services: userData.services,
        stats: {
            totalConversations,
            conversationsThisMonth,
            totalMessages: messagesCount,
            totalFiles: userData.attachments.length,
            storageUsed: storageInMB,
            accountAge: Math.floor((Date.now() - new Date(userData.createdAt).getTime()) / (1000 * 60 * 60 * 24))
        }
    }
})
