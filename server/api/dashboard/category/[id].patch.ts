export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id')

    const result = await readValidatedBody(event, (v) => categorySchema.partial().safeParse(v))

    if (!result.success) throw result.error.issues

    const response = await prisma.category.update({ data: result.data, where: { id } })

    return response
})
