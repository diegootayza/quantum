export default defineEventHandler(async (event) => {
    const conversationId = getRouterParam(event, 'id')

    const attachments = await prisma.attachment.findMany({
        where: { conversationId },
    })

    for await (const attachment of attachments) {
        await storageDelete(attachment.r2Key!)
    }

    await prisma.$transaction([prisma.attachment.deleteMany({ where: { conversationId } }), prisma.message.deleteMany({ where: { conversationId } }), prisma.conversation.delete({ where: { id: conversationId } })])

    return { message: 'Conversación eliminada' }
})
