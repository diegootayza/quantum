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

    const creditPackage = await prisma.creditPackage.findUnique({
        where: { id: result.data.id },
        include: {
            _count: {
                select: {
                    creditTransactions: true,
                },
            },
        },
    })

    if (!creditPackage) {
        throw createError({
            message: 'Paquete de créditos no encontrado',
            statusCode: 404,
        })
    }

    return creditPackage
})
