import { z } from 'zod'

const schema = z.object({})

export default defineEventHandler((event) => {
    return processError(async () => {
        const result = await getValidatedQuery(event, schema.safeParse)

        if (!result.success) throw result.error.issues

        const response = await prisma.prompt.findMany()

        return response
    })
})
