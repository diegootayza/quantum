import type { UIMessageStreamWriter } from 'ai'

import { openai } from '@ai-sdk/openai'
import { generateText, tool } from 'ai'
import z from 'zod'

function base64Size(base64: string) {
    let padding = 0
    if (base64.endsWith('==')) padding = 2
    else if (base64.endsWith('=')) padding = 1

    const size = (base64.length * 3) / 4 - padding
    return Math.round(size)
}

function createHeartbeat(writer: UIMessageStreamWriter, intervalMs = 5000) {
    const interval = setInterval(() => {
        writer.write({
            data: { timestamp: Date.now() },
            type: 'data-heartbeat',
        })
    }, intervalMs)

    return () => clearInterval(interval)
}

async function withHeartbeat<T>(writer: UIMessageStreamWriter, fn: () => Promise<T>): Promise<T> {
    const stopHeartbeat = createHeartbeat(writer)
    try {
        return await fn()
    }
    finally {
        stopHeartbeat()
    }
}

export const toolGenerateImage = (conversationId: string, writer: UIMessageStreamWriter) => {
    return tool({
        description: 'Genera una imagen usando el modelo de imágenes de OpenAI.',
        execute: async ({ prompt }) => {
            return withHeartbeat(writer, async () => {
                const response: { url: string }[] = []

                const result = await generateText({
                    model: openai('gpt-5'),
                    prompt,
                    tools: {
                        image_generation: openai.tools.imageGeneration({
                            outputFormat: 'png',
                            quality: 'medium',
                        }),
                    },
                })

                for (const toolResult of result.staticToolResults) {
                    if (toolResult.toolName === 'image_generation') {
                        const base64Image = toolResult.output.result

                        const key = `conversations/${conversationId}/generated/${Date.now()}-image.png`
                        const url = await storageUpload(key, Buffer.from(base64Image, 'base64'), 'image/png')

                        await prisma.conversationAttachment.create({
                            data: {
                                conversationId,
                                key,
                                mimeType: 'image/png',
                                size: base64Size(base64Image),
                                source: 'AI_GENERATED',
                            },
                        })

                        response.push({ url })
                    }
                }

                return response
            })
        },
        inputSchema: z.object({
            prompt: z.string().describe('Descripción clara de la imagen que quieres generar.'),
        }),
    })
}
