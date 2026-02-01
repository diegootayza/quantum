export default defineEventHandler((event) => {
    return processError(async () => {
        const id = getRouterParam(event, 'id')

        const conversations = await prisma.conversation.findMany({
            select: { id: true },
            where: { userId: id },
        })

        const conversationIds = conversations.map((c) => c.id)

        if (conversationIds.length > 0) {
            await prisma.conversationMessage.deleteMany({
                where: { conversationId: { in: conversationIds } },
            })

            await prisma.conversationAttachment.deleteMany({
                where: { conversationId: { in: conversationIds } },
            })

            await prisma.conversation.deleteMany({
                where: { id: { in: conversationIds } },
            })
        }

        return await prisma.user.delete({ where: { id } })
    })
})
