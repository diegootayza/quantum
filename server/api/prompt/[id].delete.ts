export default defineEventHandler((event) => {
    return processError(async () => {
        const id = getRouterParam(event, 'id')
        return await prisma.prompt.delete({ where: { id } })
    })
})
