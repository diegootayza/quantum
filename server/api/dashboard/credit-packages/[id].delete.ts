import { z } from 'zod'


export default defineEventHandler(async (event) => {
    const result = await getValidatedRouterParams(event, (v) =>
        z.object({ id: z.string() }).safeParse(v),
    )

    if (!result.success) {
        throw createError({
            message: result.error.errors[0].message,
            statusCode: 400,
        })
    }

    // Verificar si el paquete tiene transacciones asociadas
    const packageWithTransactions = await prisma.creditPackage.findUnique({
        where: { id: result.data.id },
        include: {
            _count: {
                select: {
                    creditTransactions: true,
                },
            },
        },
    })

    if (!packageWithTransactions) {
        throw createError({
            message: 'Paquete de créditos no encontrado',
            statusCode: 404,
        })
    }

    // Si tiene transacciones, solo desactivar en lugar de eliminar
    if (packageWithTransactions._count.creditTransactions > 0) {
        const updated = await prisma.creditPackage.update({
            where: { id: result.data.id },
            data: { active: false },
        })

        return {
            message: 'Paquete desactivado (tiene transacciones asociadas)',
            package: updated,
        }
    }

    // Si no tiene transacciones, eliminar completamente
    await prisma.creditPackage.delete({
        where: { id: result.data.id },
    })

    return {
        message: 'Paquete eliminado exitosamente',
    }
})
