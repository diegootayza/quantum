export default defineEventHandler((event) => {
    return processError(async () => {
        const data = await readValidatedBody(event, chatSchema.parse)
        return await prisma.chat.create({ data })
    })
})
