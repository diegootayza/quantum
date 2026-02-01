export default defineEventHandler((event) => {
    return processError(async () => {
        const id = getRouterParam(event, 'id')

        const result = await readValidatedBody(event, promptSchema.partial().safeParse)

        if (!result.success) throw result.error.issues

        const response = await prisma.prompt.update({ data: result.data, where: { id } })

        return response
    })
})
