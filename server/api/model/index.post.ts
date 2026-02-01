export default defineEventHandler((event) => {
    return processError(async () => {
        const data = await readValidatedBody(event, modelSchema.parse)
        return await prisma.model.create({ data })
    })
})
