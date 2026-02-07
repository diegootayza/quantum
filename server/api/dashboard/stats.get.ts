export default defineEventHandler((event) => {
    return processError(async () => {
        const { user } = await requireUserSession(event)

        if (user.role !== 'ADMIN') {
            throw createError({ message: 'Acceso denegado.', statusCode: 403 })
        }

        // Total users
        const totalUsers = await prisma.user.count()
        const activeUsers = await prisma.user.count({ where: { active: true } })

        // Messages

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
                conversationsLast30Days: 0,
                totalConversations: 0,
                totalMessages: 0,
                totalUsers,
            },
        }
    })
})
