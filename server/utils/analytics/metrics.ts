/**
 * Sistema de métricas de negocio para SaaS
 */

interface BusinessMetrics {
    arr: number // Annual Recurring Revenue
    churnRate: number
    conversionRate: number
    ltv: number // Lifetime Value
    mrr: number // Monthly Recurring Revenue
}

interface GrowthMetrics {
    activeUsers: number
    newUsers: number
    newUsersGrowth: number
    totalUsers: number
}

interface SubscriptionMetrics {
    activeSubscriptions: number
    averageRevenuePerUser: number
    cancelledSubscriptions: number
    newSubscriptions: number
    subscriptionsByPlan: Record<string, number>
}

/**
 * Calcula el MRR (Monthly Recurring Revenue)
 */
export async function calculateMRR(): Promise<number> {
    const activeSubscriptions = await prisma.subscription.findMany({
        select: {
            interval: true,
            price: true,
            users: {
                select: {
                    id: true,
                },
            },
        },
        where: {
            active: true,
        },
    })

    let mrr = 0

    activeSubscriptions.forEach((sub) => {
        const userCount = sub.users.length

        if (sub.interval === 'MONTHLY') {
            mrr += sub.price * userCount
        } else if (sub.interval === 'YEARLY') {
            // Convertir anual a mensual
            mrr += (sub.price / 12) * userCount
        }
    })

    return Math.round(mrr * 100) / 100
}

/**
 * Calcula el ARR (Annual Recurring Revenue)
 */
export async function calculateARR(): Promise<number> {
    const mrr = await calculateMRR()
    return Math.round(mrr * 12 * 100) / 100
}

/**
 * Calcula la tasa de churn (cancelaciones)
 */
export async function calculateChurnRate(days: number = 30): Promise<number> {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const startOfPeriod = await prisma.user.count({
        where: {
            AND: [{ subscriptionId: { not: null } }, { createdAt: { lt: startDate } }],
        },
    })

    const cancelled = await prisma.analyticsEvent.count({
        where: {
            AND: [
                { eventType: 'subscription_cancelled' },
                { timestamp: { gte: startDate } },
            ],
        },
    })

    if (startOfPeriod === 0) return 0

    return Math.round((cancelled / startOfPeriod) * 100 * 100) / 100
}

/**
 * Calcula la tasa de conversión (trial a pago)
 */
export async function calculateConversionRate(days: number = 30): Promise<number> {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const signups = await prisma.analyticsEvent.count({
        where: {
            AND: [{ eventType: 'user_signed_up' }, { timestamp: { gte: startDate } }],
        },
    })

    const conversions = await prisma.analyticsEvent.count({
        where: {
            AND: [
                { eventType: 'subscription_created' },
                { timestamp: { gte: startDate } },
            ],
        },
    })

    if (signups === 0) return 0

    return Math.round((conversions / signups) * 100 * 100) / 100
}

/**
 * Calcula el LTV (Lifetime Value) promedio
 */
export async function calculateLTV(): Promise<number> {
    const mrr = await calculateMRR()
    const churnRate = await calculateChurnRate()

    if (churnRate === 0) return 0

    // LTV = ARPU / Churn Rate
    const activeUsers = await prisma.user.count({
        where: { subscriptionId: { not: null } },
    })

    if (activeUsers === 0) return 0

    const arpu = mrr / activeUsers
    const ltv = arpu / (churnRate / 100)

    return Math.round(ltv * 100) / 100
}

/**
 * Obtiene todas las métricas de negocio
 */
export async function getBusinessMetrics(): Promise<BusinessMetrics> {
    const [mrr, arr, churnRate, conversionRate, ltv] = await Promise.all([
        calculateMRR(),
        calculateARR(),
        calculateChurnRate(),
        calculateConversionRate(),
        calculateLTV(),
    ])

    return {
        arr,
        churnRate,
        conversionRate,
        ltv,
        mrr,
    }
}

/**
 * Obtiene métricas de crecimiento
 */
export async function getGrowthMetrics(days: number = 30): Promise<GrowthMetrics> {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const previousPeriodStart = new Date(startDate)
    previousPeriodStart.setDate(previousPeriodStart.getDate() - days)

    const [totalUsers, newUsers, previousNewUsers, activeUsers] = await Promise.all([
        prisma.user.count(),
        prisma.user.count({
            where: { createdAt: { gte: startDate } },
        }),
        prisma.user.count({
            where: {
                AND: [
                    { createdAt: { gte: previousPeriodStart } },
                    { createdAt: { lt: startDate } },
                ],
            },
        }),
        prisma.user.count({
            where: { active: true },
        }),
    ])

    const newUsersGrowth =
        previousNewUsers === 0
            ? 0
            : Math.round(((newUsers - previousNewUsers) / previousNewUsers) * 100 * 100) /
            100

    return {
        activeUsers,
        newUsers,
        newUsersGrowth,
        totalUsers,
    }
}

/**
 * Obtiene métricas de suscripciones
 */
export async function getSubscriptionMetrics(
    days: number = 30
): Promise<SubscriptionMetrics> {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const [activeSubscriptions, newSubscriptions, cancelledSubscriptions, subscriptions] =
        await Promise.all([
            prisma.user.count({
                where: { subscriptionId: { not: null } },
            }),
            prisma.analyticsEvent.count({
                where: {
                    AND: [
                        { eventType: 'subscription_created' },
                        { timestamp: { gte: startDate } },
                    ],
                },
            }),
            prisma.analyticsEvent.count({
                where: {
                    AND: [
                        { eventType: 'subscription_cancelled' },
                        { timestamp: { gte: startDate } },
                    ],
                },
            }),
            prisma.subscription.findMany({
                select: {
                    name: true,
                    price: true,
                    users: {
                        select: {
                            id: true,
                        },
                    },
                },
                where: { active: true },
            }),
        ])

    // Calcular distribución por plan
    const subscriptionsByPlan: Record<string, number> = {}
    subscriptions.forEach((sub) => {
        subscriptionsByPlan[sub.name] = sub.users.length
    })

    // Calcular ARPU
    const mrr = await calculateMRR()
    const averageRevenuePerUser =
        activeSubscriptions === 0
            ? 0
            : Math.round((mrr / activeSubscriptions) * 100) / 100

    return {
        activeSubscriptions,
        averageRevenuePerUser,
        cancelledSubscriptions,
        newSubscriptions,
        subscriptionsByPlan,
    }
}

/**
 * Obtiene métricas de uso de producto
 */
export async function getProductMetrics(days: number = 30) {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const [
        totalConversations,
        totalMessages,
        totalImagesGenerated,
        totalFilesUploaded,
        conversationsThisPeriod,
        messagesThisPeriod,
        imagesThisPeriod,
    ] = await Promise.all([
        prisma.conversation.count(),
        prisma.message.count(),
        prisma.attachment.count({
            where: {
                mimeType: {
                    startsWith: 'image/',
                },
            },
        }),
        prisma.attachment.count(),
        prisma.conversation.count({
            where: { createdAt: { gte: startDate } },
        }),
        prisma.message.count({
            where: { createdAt: { gte: startDate } },
        }),
        prisma.attachment.count({
            where: {
                AND: [
                    { createdAt: { gte: startDate } },
                    {
                        mimeType: {
                            startsWith: 'image/',
                        },
                    },
                ],
            },
        }),
    ])

    return {
        conversationsThisPeriod,
        imagesThisPeriod,
        messagesThisPeriod,
        totalConversations,
        totalFilesUploaded,
        totalImagesGenerated,
        totalMessages,
    }
}
