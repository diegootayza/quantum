import { z } from 'zod'

const schema = z.object({})

export default defineEventHandler(async (event) => {
    const result = await getValidatedQuery(event, (v) => schema.safeParse(v))

    if (!result.success) throw result.error.issues

    const response = await prisma.instruction.findMany({
        select: {
            active: true,
            category: {
                select: {
                    name: true,
                },
            },
            categoryId: true,
            content: true,
            description: true,
            id: true,
            name: true,
        },
    })

    return response
})
