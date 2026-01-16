import { gateway } from '@ai-sdk/gateway'
import { generateText, tool } from 'ai'
import z from 'zod'

function base64Size(base64: string) {
    let padding = 0
    if (base64.endsWith('==')) padding = 2
    else if (base64.endsWith('=')) padding = 1

    const size = (base64.length * 3) / 4 - padding
    return Math.round(size)
}

export const toolGenerateImage = (conversationId: string) => {
    return tool({
        description: 'Genera una imagen usando el modelo de imágenes de OpenAI.',
        execute: async ({ prompt }) => {
            const result = await generateText({
                model: gateway('google/gemini-2.5-flash-image'),
                prompt,
            })

            const response: { url: string }[] = []
            const prefix = import.meta.dev ? 'test/' : ''

            for await (const file of result.files) {
                const key = `${prefix}conversations/${conversationId}/generated/${Date.now()}-image.png`
                const url = await storageUpload(key, Buffer.from(file.base64, 'base64'), file.mediaType)

                await prisma.conversationAttachment.create({
                    data: {
                        conversationId,
                        key,
                        mimeType: file.mediaType,
                        size: base64Size(file.base64),
                        source: 'AI_GENERATED',
                    },
                })

                response.push({ url })
            }

            return response
        },
        inputSchema: z.object({
            prompt: z.string().describe('Descripción clara de la imagen que quieres generar.'),
        }),
    })
}
