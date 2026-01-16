export default defineEventHandler(async (event) => {
    const conversationId = getRouterParam(event, 'id')

    const attachments = await prisma.conversationAttachment.findMany({
        where: { conversationId },
    })

    await prisma.$transaction([prisma.conversationAttachment.deleteMany({ where: { conversationId } }), prisma.conversationMessage.deleteMany({ where: { conversationId } }), prisma.conversation.delete({ where: { id: conversationId } })])

    for await (const attachment of attachments) {
        await storageDelete(attachment.key!)
    }

    return { message: 'Conversación eliminada' }
})
