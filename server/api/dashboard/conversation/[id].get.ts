import { z } from 'zod'

const schema = z.object({
    id: z.string(),
})

export default defineEventHandler(async (event) => {
    const result = await getValidatedRouterParams(event, (v) => schema.safeParse(v))

    if (!result.success) throw result.error.issues

    const response = await prisma.conversation.findUnique({ where: { id: result.data.id } })

    return response
})
