import type { Prisma } from '@prisma/client'
import type { UIMessage } from 'ai'

import { convertToModelMessages, createUIMessageStream, createUIMessageStreamResponse, smoothStream, streamText } from 'ai'
import { z } from 'zod'

const params = z.object({
    id: z.string(),
})

const body = z.object({
    agentId: z.string().optional().nullable(),
    messages: z.array(z.custom<UIMessage>()),
})

export default defineEventHandler((event) => {
    return processError(async () => {
        const { user } = await requireUserSession(event)
        const { id } = await getValidatedRouterParams(event, params.parse)
        const { agentId, messages } = await readValidatedBody(event, body.parse)
        const ai = await getSettingValue<ISettingAi>('ai')
        const chatModel = getCookie(event, 'chat-model')
        const userId = user.id

        let model = chatModel || ai.modelText
        let system = ai.prompt

        if (agentId) {
            const agent = await prisma.chatAgent.findUnique({ select: { instruction: true, model: true }, where: { id: agentId } })

            if (agent) {
                model = agent.model
                system = `${system}\n\n\n${agent.instruction}`
            }
        }

        const lastMessage = messages[messages.length - 1]

        if (messages.length > 1 && lastMessage?.role === 'user') {
            await prisma.chatMessage.create({ data: { chatId: id, parts: lastMessage.parts as any, role: 'user', userId } })
        }

        const stream = createUIMessageStream({
            execute: async ({ writer }) => {
                const result = streamText({
                    experimental_telemetry: {
                        isEnabled: true,
                    },
                    experimental_transform: smoothStream(),
                    messages: await convertToModelMessages(messages),
                    model,
                    async onFinish({ usage }) {
                        await saveUsageTokens({ model, usage, userId })
                    },
                    system,
                    toolChoice: 'auto',
                    tools: {
                        'fetch-url': await fetchUrlTool({ userId, writer }),
                        'generate-image': await generateImageTool({ userId, writer }),
                    },
                })

                writer.merge(result.toUIMessageStream())
            },
            onFinish: async ({ messages }) => {
                const data: Prisma.ChatMessageCreateManyInput[] = []

                for (const message of messages) {
                    const parts: UIMessage['parts'] = []

                    for (const part of message.parts) {
                        transformResponseText(part, parts)
                        transformResponseTool(part, parts)
                        transformResponseFiles(part, parts)
                    }

                    if (parts.length === 0) continue

                    data.push({ chatId: id, parts: parts as any, role: message.role, userId })
                }

                if (data.length > 0) await prisma.chatMessage.createMany({ data })
            },
        })

        return createUIMessageStreamResponse({
            stream,
        })
    })
})
