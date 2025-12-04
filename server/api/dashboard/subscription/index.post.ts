export default defineEventHandler(async (event) => {
    const result = await readValidatedBody(event, (v) => subscriptionSchema.safeParse(v))

    if (!result.success) throw result.error.issues

    const response = await prisma.subscription.create({
        data: result.data,
    })

    return response
})
