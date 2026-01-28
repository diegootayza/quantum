import { z } from 'zod'

const query = z.object({})

export default defineEventHandler(async (event) => {
    return processError(async () => {
        const {} = await getValidatedQuery(event, query.parse)
        return await prisma.chat.findMany({ orderBy: { name: 'asc' } })
    })
})
