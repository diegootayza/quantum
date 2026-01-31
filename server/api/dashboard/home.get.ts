export default defineEventHandler(async (event) => {
    return processError(async () => {
        const totalChats = await prisma.chat.count()
        const totalMessages = await prisma.chatMessage.count()
        const totalUsers = await prisma.user.count()

        const usageByModel = await prisma.usage.groupBy({ _sum: { totalTokens: true }, by: ['model'] })

        return {
            totalChats,
            totalMessages,
            totalUsers,
            usageByModel: usageByModel.map((item) => ({
                label: item.model,
                value: item._sum.totalTokens || 0,
            })),
        }
    })
})
