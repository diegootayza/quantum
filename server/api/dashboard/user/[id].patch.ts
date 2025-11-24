export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id')

    const result = await readValidatedBody(event, (v) => userSchema.partial().safeParse(v))

    if (!result.success) throw result.error.issues

    const response = await prisma.user.update({ data: result.data, where: { id } })

    return response
})
