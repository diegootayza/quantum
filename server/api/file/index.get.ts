export default defineEventHandler((event) => {
    return processError(async () => {
        const { user } = await requireUserSession(event)
        return await connectGet<IFileSchema[]>('api/file', { params: { userId: user.id } })
    })
})
