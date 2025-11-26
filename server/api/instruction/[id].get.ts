import { z } from 'zod'

const schema = z.object({
    id: z.string(),
})

export default defineEventHandler(async (event) => {
    const { id } = await getValidatedRouterParams(event, schema.parse)

    const response = await prisma.instruction.findUnique({
        select: {
            description: true,
            id: true,
            name: true,
        },
        where: { id },
    })

    return response
})
