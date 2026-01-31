import type { UIMessageStreamWriter } from 'ai'

import { openai } from '@ai-sdk/openai'
import { generateImage, tool } from 'ai'
import z from 'zod'

export async function generateImageTool({ userId, writer }: { userId: string; writer: UIMessageStreamWriter }) {
    return tool({
        description: 'Genera una o varias imágenes usando el modelo de imágenes de OpenAI.',
        execute: async ({ n, prompt }) => {
            return withHeartbeat(writer, async () => {
                const errorText = `Error al generar ${n > 1 ? 'las imágenes' : 'la imagen'}.`

                try {
                    const { images, usage } = await generateImage({
                        model: openai.image('gpt-image-1-mini'),
                        n,
                        prompt,
                        providerOptions: {
                            openai: { quality: 'medium' },
                        },
                        size: '1024x1024',
                    })

                    await prisma.usage.create({
                        data: {
                            inputTokens: usage.inputTokens || 0,
                            model: 'gpt-image-1-mini',
                            outputTokens: usage.outputTokens || 0,
                            totalTokens: usage.totalTokens || 0,
                            userId,
                        },
                    })

                    const response = await connectUpload({
                        data: images.map((image) => ({ base64: image.base64, mediaType: image.mediaType })),
                        path: `users/${userId}/generations`,
                        type: 'generated',
                        userId,
                    })

                    if (!response) throw new Error(errorText)

                    return response.map((file) => file.url)
                } catch (error) {
                    console.log(error)
                    throw new Error(errorText)
                }
            })
        },
        inputSchema: z.object({
            n: z.number().int().min(1).max(4).default(1).describe('Número de imágenes a generar (1-4)'),
            prompt: z.string().describe('El mensaje que debe utilizarse para generar la imagen'),
        }),
        outputSchema: z.array(z.string()),
    })
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
    } finally {
        stopHeartbeat()
    }
}
