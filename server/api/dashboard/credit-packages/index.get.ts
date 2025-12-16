

export default defineEventHandler(async (event) => {
    const packages = await prisma.creditPackage.findMany({
        orderBy: {
            createdAt: 'desc',
        },
        include: {
            _count: {
                select: {
                    creditTransactions: true,
                },
            },
        },
    })

    return packages
})
