import { z } from 'zod'


export default defineEventHandler(async (event) => {
    const paramsResult = await getValidatedRouterParams(event, (v) =>
        z.object({ id: z.string() }).safeParse(v),
    )

    if (!paramsResult.success) {
        throw createError({
            message: paramsResult.error.errors[0].message,
            statusCode: 400,
        })
    }

    const bodyResult = await readValidatedBody(event, (v) => creditPackageSchema.partial().safeParse(v))

    if (!bodyResult.success) {
        throw createError({
            message: bodyResult.error.errors[0].message,
            statusCode: 400,
        })
    }

    const creditPackage = await prisma.creditPackage.update({
        where: { id: paramsResult.data.id },
        data: bodyResult.data,
    })

    return creditPackage
})
