export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id')

    const conversations = await prisma.conversation.findMany({
        select: { id: true },
        where: { userId: id },
    })

    const conversationIds = conversations.map((c) => c.id)

    if (conversationIds.length > 0) {
        const attachments = await prisma.conversationAttachment.findMany({
            select: { key: true },
            where: { conversationId: { in: conversationIds } },
        })

        for (const attachment of attachments) {
            if (attachment.key) {
                try {
                    await storageDelete(attachment.key)
                } catch (error) {
                    console.error(`Error eliminando archivo de R2: ${attachment.key}`, error)
                }
            }
        }

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
