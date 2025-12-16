export default defineEventHandler(async () => {
    return await processError(async () => {
        return await prisma.model.findMany()
    })
})
