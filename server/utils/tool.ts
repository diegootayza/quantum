import { gateway } from '@ai-sdk/gateway'
import { generateText, tool } from 'ai'
import { extension } from 'mime-types'
import z from 'zod'

function base64Size(base64: string) {
    let padding = 0
    if (base64.endsWith('==')) padding = 2
    else if (base64.endsWith('=')) padding = 1

    const size = (base64.length * 3) / 4 - padding
    return Math.round(size) // bytes
}

export const toolGenerateImage = (conversationId: string, userId: string) => {
    return tool({
        description: 'Genera una imagen usando el modelo de imágenes de OpenAI.',
        execute: async ({ prompt }) => {
            const result = await generateText({
                model: gateway('google/gemini-3-pro-image'),
                prompt,
            })

            const response: { url: string }[] = []

            for await (const file of result.files) {
                const attachment = await prisma.attachment.create({
                    data: {
                        conversationId,
                        mimeType: file.mediaType,
                        size: base64Size(file.base64),
                        userId,
                    },
                })

                const r2Key = `conversations/${conversationId}/${attachment.id}.${extension(attachment.mimeType) || 'bin'}`

                const url = await storageUpload(r2Key, Buffer.from(file.base64, 'base64'), attachment.mimeType)

                await prisma.attachment.update({
                    data: { r2Key, url },
                    where: { id: attachment.id },
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
