import { z } from 'zod'

const querySchema = z.object({})

export default defineEventHandler(async (event) => {
    const { secure } = await getUserSession(event)
    const {} = await getValidatedQuery(event, querySchema.parse)

    const response = await prisma.attachment.findMany({
        where: { userId: secure!.id },
    })

    return response
})
