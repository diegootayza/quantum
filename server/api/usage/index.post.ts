export default defineEventHandler(async (event) => {
    return processError(async () => {
        const data = await readValidatedBody(event, usageSchema.parse)
        return await prisma.usage.create({ data })
    })
})
