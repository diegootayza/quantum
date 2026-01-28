import { z } from 'zod'

const params = z.object({
    id: z.string(),
})

export default defineEventHandler(async (event) => {
    return processError(async () => {
        const { id } = await getValidatedRouterParams(event, params.parse)
        return await prisma.chat.delete({ where: { id } })
    })
})
