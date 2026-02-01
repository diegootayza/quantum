export default defineEventHandler((event) => {
    return processError(async () => {
        const data = await readValidatedBody(event, chatAgentSchema.parse)
        return await prisma.chatAgent.create({ data })
    })
})
