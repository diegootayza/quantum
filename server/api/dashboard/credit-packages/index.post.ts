

export default defineEventHandler(async (event) => {
    const result = await readValidatedBody(event, (v) => creditPackageSchema.safeParse(v))

    if (!result.success) {
        throw createError({
            message: result.error.errors[0].message,
            statusCode: 400,
        })
    }

    const creditPackage = await prisma.creditPackage.create({
        data: result.data,
    })

    return creditPackage
})
