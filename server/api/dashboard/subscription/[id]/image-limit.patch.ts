import { z } from 'zod'

const updateLimitSchema = z.object({
    imageGenerationLimit: z.number().min(0, 'El límite debe ser mayor o igual a 0'),
})

/**
 * Endpoint para actualizar el límite de generación de imágenes de una suscripción
 */
export default defineEventHandler(async (event) => {
    await requireUserSession(event, { role: 'ADMIN' })

    const { id } = await getValidatedRouterParams(event, z.object({ id: z.string() }).parse)

    const result = await readValidatedBody(event, (v) => updateLimitSchema.safeParse(v))

    if (!result.success) {
        throw createError({ statusCode: 400, statusMessage: result.error.message })
    }

    const subscription = await prisma.subscription.update({
        data: {
            imageGenerationLimit: result.data.imageGenerationLimit,
        },
        where: { id },
    })

    return subscription
})
