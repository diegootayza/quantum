import { z } from 'zod'

const schema = z.object({})

export default defineEventHandler(async (event) => {
    const result = await getValidatedQuery(event, (v) => schema.safeParse(v))

    if (!result.success) throw result.error.issues

    const response = await prisma.service.findMany()

    return response
})
