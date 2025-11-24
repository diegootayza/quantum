import type { UIMessage } from 'ai'

import { gateway } from '@ai-sdk/gateway'
import { convertToModelMessages, createUIMessageStream, createUIMessageStreamResponse, generateText, smoothStream, stepCountIs, streamText } from 'ai'
import { z } from 'zod'

defineRouteMeta({
    openAPI: {
        description: 'Chat with AI.',
        tags: ['ai'],
    },
})

export default defineEventHandler(async (event) => {
    const session = await getUserSession(event)

    const { id } = await getValidatedRouterParams(event, z.object({ id: z.string() }).parse)

    const { messages, model } = await readValidatedBody(event, z.object({ messages: z.array(z.custom<UIMessage>()) }).parse)

    const conversation = await prisma.conversation.findUnique({
        include: { messages: true },
        where: { id },
    })

    if (!conversation) {
        throw createError({ statusCode: 404, statusMessage: 'Chat not found' })
    }

    if (!conversation.name) {
        const { text: name } = await generateText({
            model: gateway('openai/gpt-4o-mini'),
            prompt: JSON.stringify(messages[0]),
            system: `You are a title generator for a chat:
          - Generate a short title based on the first user's message
          - The title should be less than 30 characters long
          - The title should be a summary of the user's message
          - Do not use quotes (' or ") or colons (:) or any other punctuation
          - Do not use markdown, just plain text`,
        })

        await prisma.conversation.update({
            data: { name },
            where: { id: conversation.id },
        })
    }

    const lastMessage = messages[messages.length - 1]
    if (lastMessage?.role === 'user' && messages.length > 1) {
        await prisma.message.create({
            data: {
                conversationId: id as string,
                parts: lastMessage.parts as any,
                role: 'user',
            },
        })
    }

    const stream = createUIMessageStream({
        execute: ({ writer }) => {
            const result = streamText({
                experimental_transform: smoothStream({ chunking: 'word' }),
                messages: convertToModelMessages(messages),
                model: gateway('openai/gpt-5-mini'),
                providerOptions: {
                    openai: {
                        reasoningEffort: 'low',
                        reasoningSummary: 'detailed',
                    },
                },
                stopWhen: stepCountIs(5),
                system: `You are a knowledgeable and helpful AI assistant. ${session.user?.name ? `The user's name is ${session.user.name}.` : ''} Your goal is to provide clear, accurate, and well-structured responses.

**FORMATTING RULES (CRITICAL):**
- ABSOLUTELY NO MARKDOWN HEADINGS: Never use #, ##, ###, ####, #####, or ######
- NO underline-style headings with === or ---
- Use **bold text** for emphasis and section labels instead
- Examples:
  * Instead of "## Usage", write "**Usage:**" or just "Here's how to use it:"
  * Instead of "# Complete Guide", write "**Complete Guide**" or start directly with content
- Start all responses with content, never with a heading

**RESPONSE QUALITY:**
- Be concise yet comprehensive
- Use examples when helpful
- Break down complex topics into digestible parts
- Maintain a friendly, professional tone`,
            })

            if (!conversation.name) {
                writer.write({
                    data: { message: 'Generating title...' },
                    transient: true,
                    type: 'data-chat-title',
                })
            }

            writer.merge(
                result.toUIMessageStream({
                    sendReasoning: true,
                })
            )
        },
        onFinish: async ({ messages }) => {
            await prisma.message.createMany({
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
