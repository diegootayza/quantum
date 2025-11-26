import type { UIMessage } from 'ai'

import { gateway } from '@ai-sdk/gateway'
import { convertToModelMessages, createUIMessageStream, createUIMessageStreamResponse, generateText, smoothStream, stepCountIs, streamText } from 'ai'
import { z } from 'zod'

export default defineEventHandler(async (event) => {
    const session = await getUserSession(event)

    const { id } = await getValidatedRouterParams(event, z.object({ id: z.string() }).parse)

    const { messages, model } = await readValidatedBody(
        event,
        z.object({
            messages: z.array(z.custom<UIMessage>()),
            model: z.string(),
        }).parse
    )

    const conversation = await prisma.conversation.findUnique({
        include: { messages: true },
        where: { id },
    })

    if (!conversation) {
        throw createError({ statusCode: 404, statusMessage: 'Conversación no encontrada' })
    }

    if (!conversation.name) {
        const { text: name } = await generateText({
            model: gateway(model),
            prompt: JSON.stringify(messages[0]),
            system: `Eres un generador de títulos para una conversación:
                    - Genera un título corto basado en el primer mensaje del usuario
                    - El título debe tener menos de 30 caracteres
                    - El título debe ser un resumen del mensaje del usuario
                    - No uses comillas (' o "), dos puntos (:) ni otra puntuación
                    - No uses Markdown, solo texto plano`,
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
                model: gateway('xai/grok-4-fast-reasoning'),
                providerOptions: {
                    openai: {
                        reasoningEffort: 'low',
                        reasoningSummary: 'detailed',
                    },
                },
                stopWhen: stepCountIs(5),
                system: `Eres un asistente de IA conocedor y servicial. ${session.user?.name ? `El nombre del usuario es ${session.user.name}.` : ''} Tu objetivo es proporcionar respuestas claras, precisas y bien estructuradas.

**REGLAS DE FORMATO (CRÍTICAS):**
- NUNCA USAR ENCABEZADOS EN MARKDOWN: No uses #, ##, ###, ####, #####, ni ######
- NO uses encabezados con subrayado como === o ---
- Utiliza **texto en negrita** para énfasis y etiquetas de secciones en su lugar
- Ejemplos:
    * En vez de "## Uso", escribe "**Uso:**" o simplemente "Así se usa:"
    * En vez de "# Guía Completa", escribe "**Guía Completa**" o comienza directamente con el contenido
- Comienza todas las respuestas con contenido, nunca con un encabezado

**CALIDAD DE LA RESPUESTA:**
- Sé conciso pero completo
- Usa ejemplos cuando sea útil
- Divide temas complejos en partes digeribles
- Mantén un tono amable y profesional`,
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
