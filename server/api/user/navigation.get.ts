export default defineEventHandler(async (event) => {
    const { user } = await getUserSession(event)

    const conversations = await prisma.conversation.findMany({
        select: {
            id: true,
            name: true,
        },
        where: { userId: user!.id },
    })

    return { conversations }
})
