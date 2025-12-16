import { z } from 'zod'

// Costo en créditos por video
const VIDEO_GENERATION_COST = 100

const generateVideoSchema = z.object({
    duration: z.number().min(1).max(60).optional().default(10),
    metadata: z.any().optional(),
    prompt: z.string().min(1, 'El prompt es requerido'),
})

export default defineEventHandler(async (event) => {
    const session = await requireUserSession(event)
    const userId = session.user.id

    const result = await readValidatedBody(event, (v) => generateVideoSchema.safeParse(v))

    if (!result.success) {
        throw createError({
            message: result.error.errors[0].message,
            statusCode: 400,
        })
    }

    const { duration, metadata, prompt } = result.data

    // Verificar si el usuario tiene suficientes créditos
    const hasEnoughCredits = await checkCredits({
        amount: VIDEO_GENERATION_COST,
        userId,
    })

    if (!hasEnoughCredits) {
        const user = await prisma.user.findUnique({
            select: { credits: true },
            where: { id: userId },
        })

        throw createError({
            data: {
                currentCredits: user?.credits || 0,
                requiredCredits: VIDEO_GENERATION_COST,
            },
            message: `Créditos insuficientes. Tienes ${user?.credits || 0} créditos, necesitas ${VIDEO_GENERATION_COST}`,
            statusCode: 402, // Payment Required
        })
    }

    try {
        // Aquí iría la lógica real de generación de video
        // Por ejemplo, llamar a una API de IA como Runway, Pika, etc.
        const videoResult = {
            duration,
            id: `video_${Date.now()}`,
            prompt,
            status: 'processing',
            url: 'https://example.com/video.mp4',
        }

        // Consumir créditos después de iniciar la generación exitosamente
        const creditResult = await consumeCredits({
            amount: VIDEO_GENERATION_COST,
            description: `Generación de video: "${prompt.substring(0, 50)}${prompt.length > 50 ? '...' : ''}"`,
            metadata: {
                duration,
                prompt,
                videoId: videoResult.id,
                ...metadata,
            },
            userId,
        })

        return {
            credits: {
                consumed: VIDEO_GENERATION_COST,
                remaining: creditResult.newBalance,
            },
            success: true,
            video: videoResult,
        }
    } catch (error) {
        // Si hay un error en la generación, no consumir créditos
        throw createError({
            message: error instanceof Error ? error.message : 'Error al generar el video',
            statusCode: 500,
        })
    }
})
