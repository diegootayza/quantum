import { z } from 'zod'

const query = z.object({
    mode: z.string().optional(),
    page: z.string().optional(),
})

export default defineEventHandler((event) => {
    return processError(async () => {
        const { mode, page } = await getValidatedQuery(event, query.parse)
        const { user } = await getUserSession(event)

        return await prisma.model.paginate({
            limit: 15,
            orderBy: { name: 'asc' },
            page: page ? parseInt(page) : 1,
            where: {
                ...(mode === 'chat' && user ? { roles: { has: user.role } } : {}),
            },
        })
    })
})
