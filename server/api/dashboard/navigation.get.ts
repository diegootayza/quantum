export default defineEventHandler((event) => {
    return processError(async () => {
        const { secure } = await requireUserSession(event)

        const conversations = await prisma.conversation.findMany({
            select: {
                id: true,
                name: true,
            },
            where: { userId: secure!.id },
        })

        const instructions = await prisma.instruction.findMany({
            select: {
                id: true,
                name: true,
            },
        })

        const chats = await prisma.chat.findMany({
            select: {
                id: true,
                name: true,
            },
            where: { userId: secure!.id },
        })

        const agents = await prisma.chatAgent.findMany({
            select: {
                id: true,
                name: true,
            },
        })

        return { agents, chats, conversations, instructions }
    })
})
