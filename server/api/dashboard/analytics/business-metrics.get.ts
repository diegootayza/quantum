/**
 * Endpoint para obtener métricas de negocio (Admin)
 */
export default defineEventHandler(async (event) => {
    await requireUserSession(event, { role: 'ADMIN' })

    const metrics = await getBusinessMetrics()

    return metrics
})
