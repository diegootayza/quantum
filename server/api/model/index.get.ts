import { z } from 'zod'

const query = z.object({
    mode: z.string().optional(),
})

export default defineEventHandler((event) => {
    return processError(async () => {
        const { mode } = await getValidatedQuery(event, query.parse)

        return await prisma.model.findMany({
            orderBy: { name: 'asc' },
            where: {
                ...(mode === 'chat' ? { roles: { has: 'USER' } } : {}),
            },
        })
    })
})
