import { gateway, generateText, type UIMessage } from 'ai'
import { z } from 'zod'

const schema = z.object({
    agentId: z.string().optional(),
    parts: z.custom<UIMessage['parts']>(),
})

export default defineEventHandler((event) => {
    return processError(async () => {
        const { secure } = await requireUserSession(event)
        const { agentId, parts } = await readValidatedBody(event, schema.parse)
        const conversationTitle = await getPromptByKey('conversation-title')

        const { text: name } = await generateText({
            model: gateway('deepseek/deepseek-v3.2'),
            prompt: JSON.stringify(parts),
            system: conversationTitle,
            temperature: 0.2,
        })

        const chat = await prisma.chat.create({ data: { agentId, name, userId: secure!.id } })
        await prisma.chatMessage.create({ data: { chatId: chat.id, parts: parts as any, role: 'user' } })
        return chat
    })
})
