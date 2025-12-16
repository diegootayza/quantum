import { z } from 'zod'

/**
 * Endpoint para obtener métricas de crecimiento (Admin)
 */
export default defineEventHandler(async (event) => {
    await requireUserSession(event, { role: 'ADMIN' })

    const query = getQuery(event)
    const days = query.days ? Number(query.days) : 30

    const [growthMetrics, subscriptionMetrics, productMetrics] = await Promise.all([
        getGrowthMetrics(days),
        getSubscriptionMetrics(days),
        getProductMetrics(days),
    ])

    return {
        growthMetrics,
        period: `${days} days`,
        productMetrics,
        subscriptionMetrics,
    }
})
