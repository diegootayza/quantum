import { z } from 'zod'

const schema = z.object({
    page: z.string().optional(),
})

export default defineEventHandler((event) => {
    return processError(async () => {
        const { page } = await getValidatedQuery(event, schema.parse)

        return await prisma.prompt.paginate({
            limit: 15,
            page: page ? parseInt(page) : 1,
        })
    })
})
