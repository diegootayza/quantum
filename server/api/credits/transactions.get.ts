
export default defineEventHandler(async (event) => {
    const session = await requireUserSession(event)
    const userId = session.user.id

    const query = getQuery(event)
    const limit = query.limit ? Number.parseInt(query.limit as string) : 50
    const offset = query.offset ? Number.parseInt(query.offset as string) : 0

    const [transactions, total] = await Promise.all([
        prisma.creditTransaction.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: limit,
            skip: offset,
            include: {
                creditPackage: {
                    select: {
                        name: true,
                        credits: true,
                    },
                },
            },
        }),
        prisma.creditTransaction.count({
            where: { userId },
        }),
    ])

    return {
        total,
        transactions,
    }
})
