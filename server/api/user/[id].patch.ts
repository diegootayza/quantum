export default defineEventHandler((event) => {
    return processError(async () => {
        const id = getRouterParam(event, 'id')

        const result = await readValidatedBody(event, userSchema.partial().parse)

        const response = await prisma.user.update({ data: result, where: { id } })

        return response
    })
})
