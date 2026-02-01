export default defineEventHandler(() => {
    return processError(async () => {
        const totalChats = await prisma.chat.count()
        const totalMessages = await prisma.chatMessage.count()
        const totalUsers = await prisma.user.count()

        const from = new Date()
        from.setHours(0, 0, 0, 0)
        from.setDate(from.getDate() - 6)

        const usageByModel = (await prisma.usage.aggregateRaw({
            pipeline: [
                { $match: { createdAt: { $gte: { $date: from } } } },
                {
                    $addFields: {
                        day: {
                            $dateToString: {
                                date: '$createdAt',
                                format: '%Y-%m-%d',
                            },
                        },
                    },
                },
                {
                    $group: {
                        _id: { day: '$day', model: '$model' },
                        tokens: { $sum: '$totalTokens' },
                    },
                },
                { $sort: { '_id.day': 1 } },
                {
                    $project: {
                        _id: 0,
                        day: '$_id.day',
                        model: '$_id.model',
                        tokens: 1,
                    },
                },
            ],
        })) as unknown as Array<{ day: string; model: string; tokens: number }>

        return {
            totalChats,
            totalMessages,
            totalUsers,
            usageByModel,
        }
    })
})
