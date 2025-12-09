import z from 'zod'

const paramSchema = z.object({
    id: z.string(),
})

export default defineEventHandler(async (event) => {
    const { secure } = await requireUserSession(event)

    const result = await readValidatedBody(event, (v) => conversationSchema.partial().safeParse(v))
    const { id } = await getValidatedRouterParams(event, paramSchema.parse)

    if (!result.success) throw result.error.issues

    const conversation = await prisma.conversation.findUnique({
        select: { userId: true },
        where: { id, userId: secure?.id },
    })

    if (!conversation) {
        throw createError({ statusCode: 404, statusMessage: 'Conversación no encontrada' })
    }

    const response = await prisma.conversation.update({ data: result.data, where: { id } })

    return response
})
