import { z } from 'zod'

const query = z.object({
    page: z.string().optional(),
})

export default defineEventHandler((event) => {
    return processError(async () => {
        const { page } = await getValidatedQuery(event, query.parse)
        return await prisma.chatAgent.paginate({
            limit: 15,
            orderBy: { name: 'asc' },
            page: page ? parseInt(page) : 1,
        })
    })
})
