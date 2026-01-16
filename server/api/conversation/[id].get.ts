import { z } from 'zod'

const paramSchema = z.object({
    id: z.string(),
})

export default defineEventHandler(async (event) => {
    const { user } = await requireUserSession(event)
    const { id } = await getValidatedRouterParams(event, paramSchema.parse)

    const response = await prisma.conversation.findUnique({
        select: {
            id: true,
            messages: {
                select: {
                    id: true,
                    parts: true,
                    role: true,
                },
            },
            name: true,
        },
        where: { id, userId: user.id },
    })

    return response
})
