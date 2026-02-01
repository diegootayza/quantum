import { z } from 'zod'

const params = z.object({
    id: z.string(),
})

export default defineEventHandler((event) => {
    return processError(async () => {
        const { id } = await getValidatedRouterParams(event, params.parse)

        // Eliminar primero los mensajes relacionados al chat
        await prisma.chatMessage.deleteMany({ where: { chatId: id } })

        // Luego eliminar el chat
        return await prisma.chat.delete({ where: { id } })
    })
})
