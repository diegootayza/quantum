/**
 * Endpoint para obtener estadísticas globales de generación de imágenes (Admin)
 */
export default defineEventHandler(async (event) => {
    await requireUserSession(event, { role: 'ADMIN' })

    // Total de imágenes generadas (contando attachments de tipo imagen)
    const totalImagesGenerated = await prisma.attachment.count({
        where: {
            mimeType: {
                startsWith: 'image/',
            },
        },
    })

    // Imágenes generadas este mes
    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)

    const imagesThisMonth = await prisma.attachment.count({
        where: {
            createdAt: {
                gte: startOfMonth,
            },
            mimeType: {
                startsWith: 'image/',
            },
        },
    })

    // Usuarios con límites
    const usersWithLimits = await prisma.user.count({
        where: {
            subscriptionId: {
                not: null,
            },
        },
    })

    // Top usuarios por generación de imágenes
    const topUsers = await prisma.user.findMany({
        orderBy: {
            imageGenerationCount: 'desc',
        },
        select: {
            email: true,
            id: true,
            imageGenerationCount: true,
            imageGenerationResetAt: true,
            name: true,
            subscription: {
                select: {
                    imageGenerationLimit: true,
                    name: true,
                },
            },
            surname: true,
        },
        take: 10,
        where: {
            imageGenerationCount: {
                gt: 0,
            },
        },
    })

    // Distribución de uso por suscripción
    const subscriptionUsage = await prisma.subscription.findMany({
        select: {
            _count: {
                select: {
                    users: true,
                },
            },
            imageGenerationLimit: true,
            name: true,
            users: {
                select: {
                    imageGenerationCount: true,
                },
            },
        },
    })

    const subscriptionStats = subscriptionUsage.map((sub) => {
        const totalUsage = sub.users.reduce((sum, user) => sum + user.imageGenerationCount, 0)
        const avgUsage = sub.users.length > 0 ? totalUsage / sub.users.length : 0

        return {
            avgUsage: Math.round(avgUsage * 10) / 10,
            limit: sub.imageGenerationLimit,
            name: sub.name,
            totalUsage,
            userCount: sub._count.users,
        }
    })

    // Usuarios cerca del límite (>80%)
    const usersNearLimit = await prisma.user.count({
        where: {
            AND: [
                {
                    subscriptionId: {
                        not: null,
                    },
                },
                {
                    subscription: {
                        imageGenerationLimit: {
                            gt: 0,
                        },
                    },
                },
            ],
        },
    })

    // Necesitamos calcular esto manualmente ya que Prisma no soporta comparaciones entre campos
    const allUsersWithSubs = await prisma.user.findMany({
        select: {
            imageGenerationCount: true,
            subscription: {
                select: {
                    imageGenerationLimit: true,
                },
            },
        },
        where: {
            subscriptionId: {
                not: null,
            },
        },
    })

    const nearLimitCount = allUsersWithSubs.filter((user) => {
        if (!user.subscription || user.subscription.imageGenerationLimit === 0) return false
        const usage = user.imageGenerationCount / user.subscription.imageGenerationLimit
        return usage >= 0.8
    }).length

    const atLimitCount = allUsersWithSubs.filter((user) => {
        if (!user.subscription) return false
        return user.imageGenerationCount >= user.subscription.imageGenerationLimit
    }).length

    return {
        overview: {
            atLimit: atLimitCount,
            imagesThisMonth,
            nearLimit: nearLimitCount,
            totalImagesGenerated,
            usersWithLimits,
        },
        subscriptionStats,
        topUsers: topUsers.map((user) => ({
            email: user.email,
            id: user.id,
            limit: user.subscription?.imageGenerationLimit || 0,
            name: `${user.name} ${user.surname}`,
            resetAt: user.imageGenerationResetAt,
            subscription: user.subscription?.name || 'Sin suscripción',
            used: user.imageGenerationCount,
        })),
    }
})
