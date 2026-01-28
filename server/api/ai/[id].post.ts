import type { UIMessage } from 'ai'

import { convertToModelMessages, createUIMessageStream, createUIMessageStreamResponse, streamText } from 'ai'
import { z } from 'zod'

const params = z.object({
    id: z.string(),
})

const body = z.object({
    agentId: z.string().optional().nullable(),
    messages: z.array(z.custom<UIMessage>()),
})

export default defineEventHandler(async (event) => {
    return processError(async () => {
        const { user } = await requireUserSession(event)
        const { id } = await getValidatedRouterParams(event, params.parse)
        const { agentId, messages } = await readValidatedBody(event, body.parse)
        const chatModel = getCookie(event, 'chat-model')

        let model = chatModel || 'openai/gpt-5-mini'
        let system = 'Eres un asistente de IA conocedor y servicial. Tu objetivo es proporcionar respuestas claras, precisas y bien estructuradas.'

        if (agentId) {
            const agent = await prisma.chatAgent.findUnique({ select: { instruction: true, model: true }, where: { id: agentId } })

            if (agent) {
                model = agent.model
                system = agent.instruction
            }
        }

        const lastMessage = messages[messages.length - 1]

        if (messages.length > 1 && lastMessage?.role === 'user') {
            await prisma.chatMessage.create({ data: { chatId: id, parts: lastMessage.parts as any, role: 'user' } })
        }

        const stream = createUIMessageStream({
            execute: async ({ writer }) => {
                const result = streamText({
                    maxOutputTokens: 1000,
                    messages: await convertToModelMessages(messages),
                    model,
                    system,
                    toolChoice: 'auto',
                    tools: {
                        'generate-image': await generateImageTool({ userId: user.id }),
                    },
                })

                writer.merge(
                    result.toUIMessageStream({
                        sendReasoning: false,
                    }),
                )
            },
            onFinish: async ({ messages }) => {
                for (const message of messages) {
                    const parts: UIMessage['parts'] = []

                    for (const part of message.parts) {
                        if (part.type === 'text') parts.push(omitObject(part, ['state']))
                        else if (part.type === 'tool-generate-image') parts.push(omitObject(part, ['state']))
                    }

                    await prisma.chatMessage.create({ data: { chatId: id, parts: parts as any, role: 'assistant' } })
                }
            },
        })

        return createUIMessageStreamResponse({
            stream,
        })
    })
})
