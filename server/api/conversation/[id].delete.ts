export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id')
    await prisma.message.deleteMany({ where: { conversationId: id } })
    await prisma.conversation.delete({ where: { id } })
    return { message: 'Conversación eliminada' }
})
