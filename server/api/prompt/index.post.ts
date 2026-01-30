export default defineEventHandler(async (event) => {
    const result = await readValidatedBody(event, promptSchema.safeParse)

    if (!result.success) throw result.error.issues

    const response = await prisma.prompt.create({
        data: result.data,
    })

    return response
})
