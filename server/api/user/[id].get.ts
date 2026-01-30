import { z } from 'zod'

const schema = z.object({
    id: z.string(),
})

export default defineEventHandler(async (event) => {
    const result = await getValidatedRouterParams(event, schema.parse)

    const response = await prisma.user.findUnique({
        select: {
            active: true,
            email: true,
            id: true,
            name: true,
            role: true,
            surname: true,
        },
        where: { id: result.id },
    })

    return response
})
