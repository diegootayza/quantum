export default defineEventHandler(async (event) => {
    const { secure } = await getUserSession(event)

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

    return { conversations, instructions }
})
