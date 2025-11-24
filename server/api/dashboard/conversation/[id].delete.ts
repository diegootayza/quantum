export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id')
    return await prisma.conversation.delete({ where: { id } })
})
