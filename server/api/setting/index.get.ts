import { z } from 'zod'

const schema = z.object({
    name: z.string(),
    namespace: z.string(),
})

export default defineEventHandler(async (event) => {
    const { name, namespace } = await getValidatedQuery(event, schema.parse)

    const doc = await prisma.setting.findUnique({
        select: { value: true },
        where: { namespace_name: { name, namespace } },
    })

    return doc?.value ?? ''
})
