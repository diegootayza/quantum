import { z } from 'zod'

import { calculateMRR } from '../../../utils/analytics/metrics'

const querySchema = z.object({
    days: z.string().optional().default('30'),
})

/**
 * Endpoint para obtener datos históricos para gráficos (Admin)
 */
export default defineEventHandler(async (event) => {
    const { secure } = await getUserSession(event)

    if (!secure || secure.role !== 'ADMIN') {
        throw createError({
            statusCode: 403,
            statusMessage: 'No autorizado',
        })
    }

    const query = getQuery(event)
    const { days } = querySchema.parse(query)
    const daysNum = Number(days)

    const startDate = new Date()
    startDate.setDate(startDate.getDate() - daysNum)

    // Obtener datos históricos de MRR (simulado por ahora)
    const mrrHistory = await getMRRHistory(daysNum)

    // Obtener nuevos usuarios por día
    const newUsersByDay = await getNewUsersByDay(daysNum)

    // Obtener eventos por día
    const eventsByDay = await getEventsByDay(daysNum)

    // Obtener distribución de suscripciones
    const subscriptionDistribution = await getSubscriptionDistribution()

    return {
        eventsByDay,
        mrrHistory,
        newUsersByDay,
        subscriptionDistribution,
    }
})

/**
 * Obtiene historial de MRR por día
 */
async function getMRRHistory(days: number) {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const history: { date: string; value: number }[] = []

    // Por ahora, generamos datos simulados
    // En producción, esto vendría de una tabla de snapshots diarios
    for (let i = 0; i < days; i++) {
        const date = new Date(startDate)
        date.setDate(date.getDate() + i)

        // Aquí calcularías el MRR real para ese día
        // Por ahora usamos un valor simulado
        const mrr = await calculateMRR()

        history.push({
            date: date.toISOString().split('T')[0],
            value: mrr,
        })
    }

    return history
}

/**
 * Obtiene nuevos usuarios por día
 */
async function getNewUsersByDay(days: number) {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const usersByDay: { count: number; date: string }[] = []

    for (let i = 0; i < days; i++) {
        const date = new Date(startDate)
        date.setDate(date.getDate() + i)

        const nextDate = new Date(date)
        nextDate.setDate(nextDate.getDate() + 1)

        const count = await prisma.user.count({
            where: {
                AND: [{ createdAt: { gte: date } }, { createdAt: { lt: nextDate } }],
            },
        })

        usersByDay.push({
            count,
            date: date.toISOString().split('T')[0],
        })
    }

    return usersByDay
}

/**
 * Obtiene eventos por día
 */
async function getEventsByDay(days: number) {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const eventTypes = [
        'image_generated',
        'conversation_created',
        'message_sent',
        'file_uploaded',
    ]

    const eventsByType: Record<string, { count: number; date: string }[]> = {}

    for (const eventType of eventTypes) {
        const events: { count: number; date: string }[] = []

        for (let i = 0; i < days; i++) {
            const date = new Date(startDate)
            date.setDate(date.getDate() + i)

            const nextDate = new Date(date)
            nextDate.setDate(nextDate.getDate() + 1)

            const count = await prisma.analyticsEvent.count({
                where: {
                    AND: [
                        { eventType },
                        { timestamp: { gte: date } },
                        { timestamp: { lt: nextDate } },
                    ],
                },
            })

            events.push({
                count,
                date: date.toISOString().split('T')[0],
            })
        }

        eventsByType[eventType] = events
    }

    return eventsByType
}

/**
 * Obtiene distribución de suscripciones
 */
async function getSubscriptionDistribution() {
    const subscriptions = await prisma.subscription.findMany({
        select: {
            name: true,
            users: {
                select: {
                    id: true,
                },
            },
        },
        where: { active: true },
    })

    const distribution: { count: number; name: string }[] = subscriptions.map((sub) => ({
        count: sub.users.length,
        name: sub.name,
    }))

    return distribution.filter((d) => d.count > 0)
}
