export default defineEventHandler(async (event) => {
    const { user } = await requireUserSession(event)

    if (user.role !== 'ADMIN') {
        throw createError({ statusCode: 403, statusMessage: 'Acceso denegado.' })
    }

    // Total users
    const totalUsers = await prisma.user.count()
    const activeUsers = await prisma.user.count({ where: { active: true } })

    // Conversations
    const totalConversations = await prisma.conversation.count()
    const conversationsLast30Days = await prisma.conversation.count({
        where: {
            createdAt: {
                gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
            },
        },
    })

    // Messages
    const totalMessages = await prisma.conversationMessage.count()

    // User growth by month (last 6 months)
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

    const usersByMonth = await prisma.user.groupBy({
        _count: true,
        by: ['createdAt'],
        where: {
            createdAt: {
                gte: sixMonthsAgo,
            },
        },
    })

    return {
        charts: {
            userGrowth: usersByMonth,
        },
        stats: {
            activeUsers,
            conversationsLast30Days,
            totalConversations,
            totalMessages,
            totalUsers,
        },
    }
})
