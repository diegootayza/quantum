import { z } from 'zod'

const schema = z.object({
    subscriptionId: z.string(),
})

export default defineEventHandler(async (event) => {
    const { user } = await requireUserSession(event)
    const result = await readValidatedBody(event, (v) => schema.safeParse(v))

    if (!result.success) {
        throw createError({
            data: result.error.issues,
            message: 'Datos inválidos',
            statusCode: 400,
        })
    }

    // Buscar la suscripción para obtener sus servicios asociados
    const subscription = await prisma.subscription.findUnique({
        where: { id: result.data.subscriptionId },
    })

    if (!subscription) {
        throw createError({
            message: 'Plan de suscripción no encontrado',
            statusCode: 404,
        })
    }

    // Actualizar usuario con el plan y sus servicios
    const updatedUser = await prisma.user.update({
        data: {
            serviceIds: subscription.serviceIds, // Asignar los servicios del plan al usuario
            subscriptionId: subscription.id,
            // También podríamos actualizar imageGenerationLimit si fuera parte del usuario,
            // pero parece que se gestiona dinámicamente o en subscription.
        },
        where: {
            id: user.id,
        },
    })

    // Actualizar la sesión del usuario para reflejar el cambio inmediatamente
    await setUserSession(event, {
        user: {
            ...user, // Mantener datos existentes
            subscriptionId: updatedUser.subscriptionId,
            // Si guardamos serviceIds en sesión, actualizarlos también, pero por defecto nuxt-auth-utils suele guardar lo básico.
            // Asumimos que role y otros datos críticos se mantienen.
        },
    })

    return updatedUser
})
