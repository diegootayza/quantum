export default defineEventHandler(async (event) => {
    const { secure } = await requireUserSession(event)

    if (!secure?.id) {
        throw createError({ statusCode: 401, statusMessage: 'No autorizado.' })
    }

    const attachments = await prisma.conversationAttachment.findMany({
        orderBy: {
            createdAt: 'desc',
        },
        where: {
            conversation: {
                userId: secure.id,
            },
        },
    })

    const r2Url = process.env.R2_URL

    return attachments.map((attachment) => ({
        ...attachment,
        url: attachment.key ? `${r2Url}/${attachment.key}` : null,
    }))
})
