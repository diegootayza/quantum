export default defineEventHandler(async (event) => {
    const response = await prisma.subscription.findMany({
        where: {
            active: true,
        },
        include: {
            services: true,
        },
    })

    return response
})
