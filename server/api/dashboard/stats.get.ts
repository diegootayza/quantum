export default defineEventHandler(async (event) => {
    // Total users
    const totalUsers = await prisma.user.count()
    const activeUsers = await prisma.user.count({ where: { active: true } })

    // Subscriptions
    const totalSubscriptions = await prisma.subscription.count()
    const usersWithSubscription = await prisma.user.count({
        where: { subscriptionId: { not: null } },
    })

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
    const totalMessages = await prisma.message.count()

    // Services
    const totalServices = await prisma.service.count()
    const activeServices = await prisma.service.count({ where: { active: true } })

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

    // Subscription distribution
    const subscriptionDistribution = await prisma.subscription.findMany({
        select: {
            _count: {
                select: {
                    users: true,
                },
            },
            name: true,
        },
    })

    return {
        charts: {
            subscriptionDistribution: subscriptionDistribution.map((sub) => ({
                name: sub.name,
                users: sub._count.users,
            })),
            userGrowth: usersByMonth,
        },
        stats: {
            activeServices,
            activeUsers,
            conversationsLast30Days,
            totalConversations,
            totalMessages,
            totalServices,
            totalSubscriptions,
            totalUsers,
            usersWithSubscription,
        },
    }
})
