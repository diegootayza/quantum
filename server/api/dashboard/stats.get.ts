export default defineEventHandler(async (event) => {
    // Total users
    const totalUsers = await prisma.user.count()
    const activeUsers = await prisma.user.count({ where: { active: true } })

    // Subscriptions
    const totalSubscriptions = await prisma.subscription.count()
    const usersWithSubscription = await prisma.user.count({
        where: { subscriptionId: { not: null } }
    })

    // Conversations
    const totalConversations = await prisma.conversation.count()
    const conversationsLast30Days = await prisma.conversation.count({
        where: {
            createdAt: {
                gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
            }
        }
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
        by: ['createdAt'],
        _count: true,
        where: {
            createdAt: {
                gte: sixMonthsAgo
            }
        }
    })

    // Subscription distribution
    const subscriptionDistribution = await prisma.subscription.findMany({
        select: {
            name: true,
            _count: {
                select: {
                    users: true
                }
            }
        }
    })

    return {
        stats: {
            totalUsers,
            activeUsers,
            totalSubscriptions,
            usersWithSubscription,
            totalConversations,
            conversationsLast30Days,
            totalMessages,
            totalServices,
            activeServices,
        },
        charts: {
            userGrowth: usersByMonth,
            subscriptionDistribution: subscriptionDistribution.map(sub => ({
                name: sub.name,
                users: sub._count.users
            }))
        }
    }
})
