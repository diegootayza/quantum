import { z } from 'zod'

const querySchema = z.object({
    days: z.string().optional().default('30'),
    eventType: z.string().optional(),
})

/**
 * Endpoint para obtener eventos de analytics (Admin)
 */
export default defineEventHandler(async (event) => {
    await requireUserSession(event, { role: 'ADMIN' })

    const query = getQuery(event)
    const { days, eventType } = querySchema.parse(query)

    const daysNum = Number(days)
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - daysNum)
    const endDate = new Date()

    if (eventType) {
        // Obtener eventos de un tipo específico
        const events = await getEventsByType(eventType as any, startDate, endDate)
        const distribution = await getEventDistribution(eventType as any, daysNum)

        return {
            distribution,
            events: events.slice(0, 100), // Limitar a 100 eventos más recientes
            total: events.length,
        }
    }

    // Obtener conteo de todos los tipos de eventos
    const eventTypes = [
        'user_signed_up',
        'user_signed_in',
        'subscription_created',
        'subscription_cancelled',
        'image_generated',
        'image_limit_reached',
        'conversation_created',
        'message_sent',
    ]

    const eventCounts = await Promise.all(
        eventTypes.map(async (type) => ({
            count: await countEventsByType(type as any, startDate, endDate),
            type,
        }))
    )

    return {
        eventCounts,
        period: `${days} days`,
    }
})
