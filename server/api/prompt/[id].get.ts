import { z } from 'zod'

const schema = z.object({
    id: z.string(),
})

export default defineEventHandler((event) => {
    return processError(async () => {
        const result = await getValidatedRouterParams(event, schema.safeParse)

        if (!result.success) throw result.error.issues

        const response = await prisma.prompt.findUnique({ where: { id: result.data.id } })

        return response
    })
})
