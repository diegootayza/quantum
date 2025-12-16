
export default defineEventHandler(async (event) => {
    const packages = await prisma.creditPackage.findMany({
        where: {
            active: true,
        },
        orderBy: {
            price: 'asc',
        },
    })

    return packages
})
