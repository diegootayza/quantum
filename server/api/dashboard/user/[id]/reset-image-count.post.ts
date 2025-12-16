import { z } from 'zod'

/**
 * Endpoint para resetear el contador de generación de imágenes de un usuario (Admin)
 */
export default defineEventHandler(async (event) => {
    await requireUserSession(event, { role: 'ADMIN' })

    const { id } = await getValidatedRouterParams(event, z.object({ id: z.string() }).parse)

    const user = await prisma.user.update({
        data: {
            imageGenerationCount: 0,
            imageGenerationResetAt: new Date(),
        },
        select: {
            email: true,
            id: true,
            imageGenerationCount: true,
            imageGenerationResetAt: true,
            name: true,
            surname: true,
        },
        where: { id },
    })

    return {
        message: 'Contador reseteado exitosamente',
        user,
    }
})
