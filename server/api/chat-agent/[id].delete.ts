import { z } from 'zod'

const params = z.object({
    id: z.string(),
})

export default defineEventHandler((event) => {
    return processError(async () => {
        const { id } = await getValidatedRouterParams(event, params.parse)
        return await prisma.chatAgent.delete({ where: { id } })
    })
})
