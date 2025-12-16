import { gateway } from '@ai-sdk/gateway'
import { generateText, tool } from 'ai'
import { extension } from 'mime-types'
import z from 'zod'

import { trackEvent } from './analytics/events'
import { checkImageGenerationLimit, incrementImageGenerationCount } from './imageLimit'
import { sendImageLimitReached, sendImageLimitWarning } from './imageNotifications'

function base64Size(base64: string) {
    let padding = 0
    if (base64.endsWith('==')) padding = 2
    else if (base64.endsWith('=')) padding = 1

    const size = (base64.length * 3) / 4 - padding
    return Math.round(size)
}

export const toolGenerateImage = (conversationId: string, userId: string) => {
    return tool({
        description: 'Genera una imagen usando el modelo de imágenes de OpenAI.',
        execute: async ({ prompt }) => {
            // Verificar límites antes de generar
            const limitCheck = await checkImageGenerationLimit(userId)

            if (!limitCheck.canGenerate) {
                // Track evento de límite alcanzado
                await trackEvent({
                    eventType: 'image_limit_reached',
                    metadata: {
                        limit: limitCheck.limit,
                        used: limitCheck.used,
                    },
                    userId,
                })

                // Enviar notificación de límite alcanzado
                await sendImageLimitReached(userId)

                throw createError({
                    statusCode: 403,
                    statusMessage: limitCheck.message,
                })
            }

            const result = await generateText({
                model: gateway('google/gemini-2.5-flash-image'),
                prompt,
            })

            const response: { url: string }[] = []
            let generatedCount = 0

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
                generatedCount++
            }

            // Incrementar contador después de generar exitosamente
            if (generatedCount > 0) {
                await incrementImageGenerationCount(userId, generatedCount)

                // Track evento de imagen generada
                await trackEvent({
                    eventType: 'image_generated',
                    metadata: {
                        count: generatedCount,
                        conversationId,
                        prompt: prompt.substring(0, 100), // Solo primeros 100 caracteres
                    },
                    userId,
                })

                // Verificar si está cerca del límite después de generar
                const newLimitCheck = await checkImageGenerationLimit(userId)
                const usagePercentage = ((limitCheck.limit - newLimitCheck.remaining) / limitCheck.limit) * 100

                // Enviar advertencia si está entre 80% y 100%
                if (usagePercentage >= 80 && usagePercentage < 100) {
                    // Track evento de advertencia
                    await trackEvent({
                        eventType: 'image_limit_warning',
                        metadata: {
                            percentage: usagePercentage,
                            remaining: newLimitCheck.remaining,
                        },
                        userId,
                    })

                    await sendImageLimitWarning(userId)
                }
            }

            return response
        },
        inputSchema: z.object({
            prompt: z.string().describe('Descripción clara de la imagen que quieres generar.'),
        }),
    })
}
