import { z } from 'zod'

const query = z.object({
    page: z.string().optional(),
})

export default defineEventHandler((event) => {
    return processError(async () => {
        const { page } = await getValidatedQuery(event, query.parse)

        return await prisma.user.paginate({
            limit: 15,
            page: page ? parseInt(page) : 1,
        })
    })
})
