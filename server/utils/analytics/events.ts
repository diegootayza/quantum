/**
 * Sistema de tracking de eventos para analytics
 */

export interface AnalyticsEvent {
    eventType: EventType
    metadata?: Record<string, any>
    timestamp?: Date
    userId?: string
}

export type EventType = 'conversation_created' | 'file_uploaded' | 'image_generated' | 'image_limit_reached' | 'image_limit_warning' | 'message_sent' | 'payment_failed' | 'payment_succeeded' | 'subscription_cancelled' | 'subscription_created' | 'subscription_downgraded' | 'subscription_upgraded' | 'user_signed_in' | 'user_signed_up'

/**
 * Cuenta eventos por tipo
 */
export async function countEventsByType(eventType: EventType, startDate?: Date, endDate?: Date) {
    const where: any = { eventType }

    if (startDate || endDate) {
        where.timestamp = {}
        if (startDate) where.timestamp.gte = startDate
        if (endDate) where.timestamp.lte = endDate
    }

    return await prisma.analyticsEvent.count({ where })
}

/**
 * Obtiene distribución de eventos por día
 */
export async function getEventDistribution(eventType: EventType, days: number = 30) {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const events = await prisma.analyticsEvent.findMany({
        select: {
            timestamp: true,
        },
        where: {
            AND: [{ eventType }, { timestamp: { gte: startDate } }],
        },
    })

    // Agrupar por día
    const distribution: Record<string, number> = {}

    events.forEach((event) => {
        const date = event.timestamp.toISOString().split('T')[0]
        distribution[date] = (distribution[date] || 0) + 1
    })

    return distribution
}

/**
 * Obtiene eventos por tipo en un rango de fechas
 */
export async function getEventsByType(eventType: EventType, startDate: Date, endDate: Date) {
    return await prisma.analyticsEvent.findMany({
        orderBy: { timestamp: 'desc' },
        where: {
            AND: [{ eventType }, { timestamp: { gte: startDate } }, { timestamp: { lte: endDate } }],
        },
    })
}

/**
 * Obtiene eventos de un usuario
 */
export async function getUserEvents(userId: string, limit: number = 100) {
    return await prisma.analyticsEvent.findMany({
        orderBy: { timestamp: 'desc' },
        take: limit,
        where: { userId },
    })
}

/**
 * Registra un evento en la base de datos
 */
export async function trackEvent(event: AnalyticsEvent) {
    try {
        await prisma.analyticsEvent.create({
            data: {
                eventType: event.eventType,
                metadata: event.metadata || {},
                timestamp: event.timestamp || new Date(),
                userId: event.userId,
            },
        })
    } catch (error) {
        console.error('Error tracking event:', error)
        // No lanzar error para no interrumpir el flujo principal
    }
}

/**
 * Registra múltiples eventos en batch
 */
export async function trackEventsBatch(events: AnalyticsEvent[]) {
    try {
        await prisma.analyticsEvent.createMany({
            data: events.map((event) => ({
                eventType: event.eventType,
                metadata: event.metadata || {},
                timestamp: event.timestamp || new Date(),
                userId: event.userId,
            })),
        })
    } catch (error) {
        console.error('Error tracking events batch:', error)
    }
}
