import { openai } from '@ai-sdk/openai'
import { generateImage, tool } from 'ai'
import z from 'zod'

export async function generateImageTool({ userId }: { userId: string }) {
    return tool({
        description: 'Genera varias imágenes usando el modelo de imágenes de OpenAI.',
        execute: async ({ numberOfImages, prompt }) => {
            const { images } = await generateImage({
                model: openai.image('gpt-image-1'),
                n: numberOfImages,
                prompt,
            })

            const response = await connectUpload({
                data: images.map((image) => ({ base64: image.base64, mediaType: image.mediaType })),
                path: `users/${userId}/generations`,
                type: 'generated',
                userId,
            })

            if (!response) return []

            return response.map((file) => file.url)
        },
        inputSchema: z.object({
            numberOfImages: z.number(),
            prompt: z.string(),
        }),
        outputSchema: z.array(z.string()),
    })
}
