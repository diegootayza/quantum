export default defineEventHandler(async (event) => {
    const result = await readValidatedBody(event, (v) => userSchema.safeParse(v))

    if (!result.success) throw result.error.issues

    const response = await prisma.user.create({
        data: result.data,
    })

    return response
})
