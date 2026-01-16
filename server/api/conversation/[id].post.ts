import type { UIMessage } from 'ai'

import { gateway } from '@ai-sdk/gateway'
import { convertToModelMessages, createUIMessageStream, createUIMessageStreamResponse, generateText, smoothStream, stepCountIs, streamText } from 'ai'
import { z } from 'zod'

const bodySchema = z.object({
    messages: z.array(z.custom<UIMessage>()),
    model: z.string(),
})

export default defineEventHandler(async (event) => {
    const { user } = await requireUserSession(event)

    const { id } = await getValidatedRouterParams(event, z.object({ id: z.string() }).parse)

    const { messages, model } = await readValidatedBody(event, bodySchema.parse)

    const conversation = await prisma.conversation.findUnique({
        select: { id: true, instruction: { select: { content: true } }, messages: { select: { parts: true, role: true } }, name: true },
        where: { id },
    })

    if (!conversation) {
        throw createError({ statusCode: 404, statusMessage: 'Conversación no encontrada' })
    }

    if (!conversation.name) {
        const promptTitle = await getSettingValue<string>('title', 'ai')

        const { text: name } = await generateText({
            model: gateway('openai/gpt-4o-mini'),
            prompt: JSON.stringify(messages[0]),
            system: promptTitle || '',
        })

        await prisma.conversation.update({
            data: { name },
            where: { id: conversation.id },
        })
    }

    const lastMessage = messages[messages.length - 1]

    if (lastMessage?.role === 'user' && messages.length > 1) {
        await prisma.conversationMessage.create({
            data: {
                conversationId: id as string,
                parts: lastMessage.parts as any,
                role: 'user',
            },
        })
    }

    const stream = createUIMessageStream({
        execute: async ({ writer }) => {
            const promptGlobal = await getSettingValue<string>('prompt', 'ai')

            const result = streamText({
                experimental_transform: smoothStream({ chunking: 'word' }),
                messages: convertToModelMessages(messages),
                model: gateway(model),
                providerOptions: {
                    openai: {
                        reasoningEffort: 'low',
                        reasoningSummary: 'detailed',
                    },
                },
                stopWhen: stepCountIs(5),
                system: `
                Eres un asistente de IA conocedor y servicial. ${user ? `El nombre completo del usuario es ${user.name} ${user.surname}.` : ''} Tu objetivo es proporcionar respuestas claras, precisas y bien estructuradas.
                Puedes usar la herramienta "generateImage" para crear imágenes cuando el usuario lo solicite, no devuelvas los enlaces.
                ${promptGlobal || ''}
                ${conversation.instruction?.content || ''}
                `,
                toolChoice: 'auto',
                tools: {
                    generateImage: toolGenerateImage(conversation.id),
                },
            })

            if (!conversation.name) {
                writer.write({
                    data: { message: 'Generando título...' },
                    transient: true,
                    type: 'data-chat-title',
                })
            }

            writer.merge(
                result.toUIMessageStream({
                    sendReasoning: false,
                })
            )
        },
        onFinish: async ({ messages }) => {
            await prisma.conversationMessage.createMany({
                data: messages.map((message) => ({
                    conversationId: conversation.id,
                    parts: message.parts as any,
                    role: message.role,
                })),
            })
        },
    })

    return createUIMessageStreamResponse({
        stream,
    })
})
