
export default defineEventHandler(async (event) => {
    const session = await requireUserSession(event)
    const userId = session.user.id

    const result = await readValidatedBody(event, (v) => consumeCreditsSchema.safeParse(v))

    if (!result.success) {
        throw createError({
            message: result.error.errors[0].message,
            statusCode: 400,
        })
    }

    const { amount, description, metadata } = result.data

    // Obtener el usuario actual
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { credits: true },
    })

    if (!user) {
        throw createError({
            message: 'Usuario no encontrado',
            statusCode: 404,
        })
    }

    // Verificar que el usuario tiene suficientes créditos
    if (user.credits < amount) {
        throw createError({
            message: 'Créditos insuficientes',
            statusCode: 400,
        })
    }

    const newBalance = user.credits - amount

    // Crear transacción y actualizar créditos del usuario
    const [transaction] = await prisma.$transaction([
        prisma.creditTransaction.create({
            data: {
                amount: -amount, // Negativo porque es consumo
                type: 'CONSUMPTION',
                description,
                balanceAfter: newBalance,
                userId,
                metadata: metadata || {},
            },
        }),
        prisma.user.update({
            where: { id: userId },
            data: { credits: newBalance },
        }),
    ])

    return {
        message: 'Créditos consumidos exitosamente',
        transaction,
        newBalance,
    }
})
