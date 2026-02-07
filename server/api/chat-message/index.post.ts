export default defineEventHandler((event) => {
    return processError(async () => {
        const { user } = await requireUserSession(event)
        const data = await readValidatedBody(event, chatMessageSchema.parse)
        return await prisma.chatMessage.create({ data: { ...data, userId: user.id } })
    })
})
