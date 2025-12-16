export async function checkImageGenerationLimit(userId: string) {
    const user = await prisma.user.findUnique({
        select: {
            id: true,
            imageGenerationCount: true,
            imageGenerationResetAt: true,
            subscription: {
                select: {
                    imageGenerationLimit: true,
                    interval: true,
                },
            },
        },
        where: { id: userId },
    })

    if (!user) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Usuario no encontrado',
        })
    }

    // Si no tiene suscripción, no puede generar imágenes
    if (!user.subscription) {
        return {
            canGenerate: false,
            limit: 0,
            message: 'Necesitas una suscripción activa para generar imágenes',
            remaining: 0,
            used: 0,
        }
    }

    const { imageGenerationLimit, interval } = user.subscription
    const now = new Date()
    const resetAt = new Date(user.imageGenerationResetAt)

    let shouldReset = false
    if (interval === 'MONTHLY') {
        const monthsDiff = (now.getFullYear() - resetAt.getFullYear()) * 12 + (now.getMonth() - resetAt.getMonth())
        shouldReset = monthsDiff >= 1
    } else if (interval === 'YEARLY') {
        const yearsDiff = now.getFullYear() - resetAt.getFullYear()
        shouldReset = yearsDiff >= 1
    }

    let currentCount = user.imageGenerationCount
    if (shouldReset) {
        await prisma.user.update({
            data: {
                imageGenerationCount: 0,
                imageGenerationResetAt: now,
            },
            where: { id: userId },
        })
        currentCount = 0
    }

    const remaining = Math.max(0, imageGenerationLimit - currentCount)
    const canGenerate = currentCount < imageGenerationLimit

    return {
        canGenerate,
        limit: imageGenerationLimit,
        message: canGenerate ? `Puedes generar ${remaining} imagen(es) más este ${interval === 'MONTHLY' ? 'mes' : 'año'}` : `Has alcanzado el límite de ${imageGenerationLimit} imágenes para este ${interval === 'MONTHLY' ? 'mes' : 'año'}`,
        remaining,
        used: currentCount,
    }
}

/**
 * Obtiene estadísticas de uso de generación de imágenes del usuario
 * @param userId - ID del usuario
 */
export async function getImageGenerationStats(userId: string) {
    const user = await prisma.user.findUnique({
        select: {
            imageGenerationCount: true,
            imageGenerationResetAt: true,
            subscription: {
                select: {
                    imageGenerationLimit: true,
                    interval: true,
                    name: true,
                },
            },
        },
        where: { id: userId },
    })

    if (!user) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Usuario no encontrado',
        })
    }

    if (!user.subscription) {
        return {
            hasSubscription: false,
            limit: 0,
            remaining: 0,
            resetAt: null,
            subscriptionName: null,
            used: 0,
        }
    }

    const limit = user.subscription.imageGenerationLimit
    const used = user.imageGenerationCount
    const remaining = Math.max(0, limit - used)

    return {
        hasSubscription: true,
        interval: user.subscription.interval,
        limit,
        remaining,
        resetAt: user.imageGenerationResetAt,
        subscriptionName: user.subscription.name,
        used,
    }
}

/**
 * Incrementa el contador de generación de imágenes del usuario
 * @param userId - ID del usuario
 * @param count - Cantidad de imágenes generadas (por defecto 1)
 */
export async function incrementImageGenerationCount(userId: string, count: number = 1) {
    await prisma.user.update({
        data: {
            imageGenerationCount: {
                increment: count,
            },
        },
        where: { id: userId },
    })
}
