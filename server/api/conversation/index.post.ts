import z from 'zod'

export default defineEventHandler(async (event) => {
    const { secure } = await getUserSession(event)

    const { instructionId, prompt } = await readValidatedBody(event, z.object({ instructionId: z.string().optional(), prompt: z.string() }).parse)

    const conversation = await prisma.conversation.create({
        data: {
            instructionId,
            name: '',
            userId: secure!.id,
        },
    })

    await prisma.message.create({
        data: {
            conversationId: conversation.id,
            parts: [{ text: prompt, type: 'text' }],
            role: 'user',
        },
    })

    return { conversationId: conversation.id }
})
