import { gateway } from '@ai-sdk/gateway'
import { generateText, tool } from 'ai'
import { randomUUID } from 'crypto'
import z from 'zod'

export const toolGenerateImage = tool({
    description: 'Genera una imagen usando el modelo de imágenes de OpenAI.',
    execute: async ({ prompt }) => {
        const result = await generateText({
            model: gateway('google/gemini-2.5-flash-image'),
            prompt,
        })

        const id = randomUUID()

        const url = storageUpload(id, Buffer.from(result.files[0].base64, 'base64'), result.files[0].mediaType)

        return url
    },
    inputSchema: z.object({
        prompt: z.string().describe('Descripción clara de la imagen que quieres generar.'),
    }),
})
