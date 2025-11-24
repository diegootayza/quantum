export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id')
    return await prisma.instruction.delete({ where: { id } })
})
