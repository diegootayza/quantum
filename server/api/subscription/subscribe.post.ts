import { z } from 'zod'

const schema = z.object({
    subscriptionId: z.string(),
})

export default defineEventHandler(async (event) => {
    const { user } = await requireUserSession(event)
    const result = await readValidatedBody(event, (v) => schema.safeParse(v))

    if (!result.success) throw result.error.issues

    const response = await prisma.user.update({
        where: {
            id: user.id,
        },
        data: {
            subscriptionId: result.data.subscriptionId,
        },
    })

    return response
})
