import { z } from 'zod'

const params = z.object({
    id: z.string(),
})

export default defineEventHandler((event) => {
    return processError(async () => {
        const { id } = await getValidatedRouterParams(event, params.parse)
        const data = (await readValidatedBody(event, chatSchema.partial().parse)) || {}
        return await prisma.chat.update({ data, where: { id } })
    })
})
