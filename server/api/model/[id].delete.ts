export default defineEventHandler(async (event) => {
    return await processError(async () => {
        const { id } = await getValidatedRouterParams(event, paramIdSchema.parse)

        return await prisma.model.delete({ where: { id } })
    })
})
