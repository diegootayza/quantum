import { z } from 'zod'

const query = z.object({
    user: z.string().optional(),
})

export default defineEventHandler(async (event) => {
    return processError(async () => {
        const { user } = await getValidatedQuery(event, query.parse)
        return await prisma.chat.findMany({
            include: { ...(user ? { user: true } : {}) },
            orderBy: { name: 'asc' },
        })
    })
})
