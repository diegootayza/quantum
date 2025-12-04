export default defineEventHandler(async (event) => {
    const result = await readValidatedBody(event, (v) => serviceSchema.safeParse(v))

    if (!result.success) throw result.error.issues

    const response = await prisma.service.create({
        data: result.data,
    })

    return response
})
