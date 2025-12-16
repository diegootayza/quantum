export default defineEventHandler(async (event) => {
    return await processError(async () => {
        const { id } = await getValidatedRouterParams(event, paramIdSchema.parse)
        const data = await readValidatedBody(event, modelSchema.partial().parse)

        return await prisma.model.update({ data, where: { id } })
    })
})
