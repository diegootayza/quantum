export default defineEventHandler(async (event) => {
    return processError(async () => {
        const data = await readValidatedBody(event, chatMessageSchema.parse)
        return await prisma.chatMessage.create({ data })
    })
})
