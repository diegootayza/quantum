import z from 'zod'

export default defineEventHandler(async (event) => {
    const session = await getUserSession(event)
    const result = await readValidatedBody(event, (v) => z.object({ prompt: z.string() }).safeParse(v))

    if (!result.success) throw result.error.issues

    const stream = await openai.responses.create({
        input: result.data.prompt,
        model: 'gpt-5-mini',
    })

    const response = await prisma.conversation.create({
        data: {
            name: 'Nueva conversación',
            userId: session.user!.id,
        },
    })

    return { conversationId: response.id }
})
