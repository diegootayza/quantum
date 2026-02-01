import { z } from 'zod'

const query = z.object({
    page: z.string().optional(),
    user: z.string().optional(),
})

export default defineEventHandler((event) => {
    return processError(async () => {
        const { page } = await getValidatedQuery(event, query.parse)
        const limit = 15
        const currentPage = page ? parseInt(page) : 1
        const skip = (currentPage - 1) * limit

        const [docs, totalDocs] = await Promise.all([
            prisma.chat.findMany({
                include: { user: true },
                orderBy: { name: 'asc' },
                skip,
                take: limit,
            }),
            prisma.chat.count(),
        ])

        return {
            docs,
            meta: {
                limit,
                page: currentPage,
                totalDocs,
                totalPages: Math.ceil(totalDocs / limit),
            },
        }
    })
})
