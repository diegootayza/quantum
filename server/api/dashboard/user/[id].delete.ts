export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id')
    return await prisma.user.delete({ where: { id } })
})
