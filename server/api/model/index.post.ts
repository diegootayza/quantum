export default defineEventHandler(async (event) => {
    const data = await readValidatedBody(event, modelSchema.parse)

    return await processError(async () => {
        return await prisma.model.create({
            data,
        })
    })
})
