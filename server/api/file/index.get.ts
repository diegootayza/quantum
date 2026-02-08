export default defineEventHandler((event) => {
    return processError(async () => {
        const { user } = await requireUserSession(event)

        const test = await prisma.chatMessage.findMany({ select: { parts: true }, take: 100, where: { role: 'assistant' } })

        for (const element of test) {
            for (const part of element.parts as any[]) {
                if (part.type === 'tool-generate-image') {
                    console.log(part.output)
                }
            }
        }

        return await connectGet<IFileSchema[]>('api/file', { params: { userId: user.id } })
    })
})
