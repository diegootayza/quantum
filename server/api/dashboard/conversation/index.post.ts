export default defineEventHandler(async (event) => {
    const result = await readValidatedBody(event, (v) => categorySchema.safeParse(v))

    if (!result.success) throw result.error.issues

    const response = await prisma.category.create({
        data: result.data,
    })

    return response
})
