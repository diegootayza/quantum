import { z } from 'zod'

const query = z.object({})

export default defineEventHandler((event) => {
    return processError(async () => {
        const {} = await getValidatedQuery(event, query.parse)
        return await prisma.chatAgent.findMany({ orderBy: { name: 'asc' } })
    })
})
