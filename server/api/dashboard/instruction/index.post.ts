export default defineEventHandler(async (event) => {
    const result = await readValidatedBody(event, (v) => instructionSchema.safeParse(v))

    if (!result.success) throw result.error.issues

    const response = await prisma.instruction.create({
        data: result.data,
    })

    return response
})
