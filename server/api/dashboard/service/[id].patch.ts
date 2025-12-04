export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id')

    const result = await readValidatedBody(event, (v) => serviceSchema.partial().safeParse(v))

    if (!result.success) throw result.error.issues

    const response = await prisma.service.update({ data: result.data, where: { id } })

    return response
})
