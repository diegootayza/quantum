import { getImageGenerationStats } from '../../utils/imageLimit'

/**
 * Endpoint para obtener estadísticas de generación de imágenes del usuario actual
 */
export default defineEventHandler(async (event) => {
    const { secure } = await getUserSession(event)

    if (!secure?.id) {
        throw createError({
            statusCode: 401,
            statusMessage: 'No autenticado',
        })
    }

    const stats = await getImageGenerationStats(secure.id)

    return stats
})
