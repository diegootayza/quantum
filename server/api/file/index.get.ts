import { z } from 'zod'

const schema = z.object({
    name: z.string(),
    namespace: z.string(),
})

export default defineEventHandler(async (event) => {
    const { user } = await requireUserSession(event)

    return await connectGet<IFileSchema[]>('api/file', { params: { userId: user.id } })
})
