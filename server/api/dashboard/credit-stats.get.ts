

export default defineEventHandler(async () => {
    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

    // Estadísticas generales
    const [
        totalCreditsInCirculation,
        totalCreditsPurchased,
        totalCreditsConsumed,
        totalRevenue,
        activeUsers,
        recentTransactions,
    ] = await Promise.all([
        // Total de créditos en circulación (suma de créditos de todos los usuarios)
        prisma.user.aggregate({
            _sum: {
                credits: true,
            },
        }),

        // Total de créditos comprados
        prisma.creditTransaction.aggregate({
            where: {
                type: 'PURCHASE',
            },
            _sum: {
                amount: true,
            },
        }),

        // Total de créditos consumidos
        prisma.creditTransaction.aggregate({
            where: {
                type: 'CONSUMPTION',
            },
            _sum: {
                amount: true,
            },
        }),

        // Ingresos totales
        prisma.creditTransaction.findMany({
            where: {
                type: 'PURCHASE',
            },
            include: {
                creditPackage: {
                    select: {
                        price: true,
                    },
                },
            },
        }),

        // Usuarios con créditos activos
        prisma.user.count({
            where: {
                credits: {
                    gt: 0,
                },
            },
        }),

        // Transacciones recientes (últimos 30 días)
        prisma.creditTransaction.findMany({
            where: {
                createdAt: {
                    gte: thirtyDaysAgo,
                },
            },
            include: {
                user: {
                    select: {
                        name: true,
                        surname: true,
                        email: true,
                    },
                },
                creditPackage: {
                    select: {
                        name: true,
                        price: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
            take: 100,
        }),
    ])

    // Calcular ingresos totales
    const revenue = totalRevenue.reduce((sum, transaction) => {
        return sum + (transaction.creditPackage?.price || 0)
    }, 0)

    // Agrupar transacciones por tipo
    const transactionsByType = await prisma.creditTransaction.groupBy({
        by: ['type'],
        _count: {
            id: true,
        },
        _sum: {
            amount: true,
        },
    })

    // Paquetes más vendidos
    const topPackages = await prisma.creditPackage.findMany({
        include: {
            _count: {
                select: {
                    creditTransactions: true,
                },
            },
        },
        orderBy: {
            creditTransactions: {
                _count: 'desc',
            },
        },
        take: 5,
    })

    // Usuarios top por consumo
    const topConsumers = await prisma.creditTransaction.groupBy({
        by: ['userId'],
        where: {
            type: 'CONSUMPTION',
        },
        _sum: {
            amount: true,
        },
        orderBy: {
            _sum: {
                amount: 'desc',
            },
        },
        take: 10,
    })

    // Obtener información de usuarios top
    const topConsumersWithDetails = await Promise.all(
        topConsumers.map(async (consumer) => {
            const user = await prisma.user.findUnique({
                where: { id: consumer.userId },
                select: {
                    name: true,
                    surname: true,
                    email: true,
                    credits: true,
                },
            })
            return {
                ...consumer,
                user,
            }
        }),
    )

    // Transacciones por día (últimos 30 días)
    const dailyTransactions = await prisma.$queryRaw<
        Array<{ date: Date; purchases: number; consumptions: number }>
    >`
        SELECT 
            DATE(createdAt) as date,
            SUM(CASE WHEN type = 'PURCHASE' THEN amount ELSE 0 END) as purchases,
            SUM(CASE WHEN type = 'CONSUMPTION' THEN ABS(amount) ELSE 0 END) as consumptions
        FROM CreditTransaction
        WHERE createdAt >= ${thirtyDaysAgo}
        GROUP BY DATE(createdAt)
        ORDER BY date DESC
    `

    return {
        overview: {
            totalCreditsInCirculation: totalCreditsInCirculation._sum.credits || 0,
            totalCreditsPurchased: totalCreditsPurchased._sum.amount || 0,
            totalCreditsConsumed: Math.abs(totalCreditsConsumed._sum.amount || 0),
            totalRevenue: revenue,
            activeUsers,
        },
        transactionsByType: transactionsByType.map((t) => ({
            type: t.type,
            count: t._count.id,
            total: t._sum.amount || 0,
        })),
        topPackages: topPackages.map((p) => ({
            id: p.id,
            name: p.name,
            credits: p.credits,
            price: p.price,
            sales: p._count.creditTransactions,
            revenue: p.price * p._count.creditTransactions,
        })),
        topConsumers: topConsumersWithDetails,
        dailyTransactions,
        recentTransactions: recentTransactions.map((t) => ({
            id: t.id,
            type: t.type,
            amount: t.amount,
            description: t.description,
            balanceAfter: t.balanceAfter,
            createdAt: t.createdAt,
            user: t.user,
            package: t.creditPackage,
        })),
    }
})
