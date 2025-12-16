export default defineEventHandler(async (event) => {
    const session = await requireUserSession(event)
    const userId = session.user.id

    const user = await prisma.user.findUnique({
        select: { credits: true },
        where: { id: userId },
    })

    if (!user) {
        throw createError({
            message: 'Usuario no encontrado',
            statusCode: 404,
        })
    }

    return {
        credits: user.credits,
    }
})
