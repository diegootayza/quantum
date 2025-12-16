
export default defineEventHandler(async (event) => {
    const session = await requireUserSession(event)
    const userId = session.user.id

    const result = await readValidatedBody(event, (v) => purchaseCreditsSchema.safeParse(v))

    if (!result.success) {
        throw createError({
            message: result.error.errors[0].message,
            statusCode: 400,
        })
    }

    const { creditPackageId } = result.data

    // Verificar que el paquete existe y está activo
    const creditPackage = await prisma.creditPackage.findUnique({
        where: { id: creditPackageId },
    })

    if (!creditPackage || !creditPackage.active) {
        throw createError({
            message: 'Paquete de créditos no encontrado o no disponible',
            statusCode: 404,
        })
    }

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

    // Calcular total de créditos (créditos del paquete + bonus)
    const totalCredits = creditPackage.credits + creditPackage.bonusCredits
    const newBalance = user.credits + totalCredits

    // Crear transacción y actualizar créditos del usuario
    const [transaction] = await prisma.$transaction([
        prisma.creditTransaction.create({
            data: {
                amount: totalCredits,
                type: 'PURCHASE',
                description: `Compra de ${creditPackage.name}`,
                balanceAfter: newBalance,
                userId,
                creditPackageId,
                metadata: {
                    packageName: creditPackage.name,
                    baseCredits: creditPackage.credits,
                    bonusCredits: creditPackage.bonusCredits,
                    price: creditPackage.price,
                    currency: creditPackage.currency,
                },
            },
            include: {
                creditPackage: true,
            },
        }),
        prisma.user.update({
            where: { id: userId },
            data: { credits: newBalance },
        }),
    ])

    return {
        message: 'Créditos comprados exitosamente',
        transaction,
        newBalance,
    }
})
