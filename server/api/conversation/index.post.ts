import type { UIMessage } from 'ai'

import { extension } from 'mime-types'
import { randomUUID } from 'node:crypto'

export default defineEventHandler(async (event) => {
    const { secure } = await requireUserSession(event)
    const formData = await readMultipartFormData(event)
    if (!formData) throw createError({ statusCode: 400, statusMessage: 'No form data provided' })

    const files = formData.filter((p) => p.name === 'files' && p.type?.startsWith('image/'))
    const instructionId = formData.find((p) => p.name === 'instructionId')?.data.toString()
    const prompt = formData.find((p) => p.name === 'prompt')?.data.toString()

    const conversation = await prisma.conversation.create({
        data: {
            instructionId,
            name: '',
            userId: secure!.id,
        },
    })

    const parts: UIMessage['parts'] = []
    const prefix = import.meta.dev ? 'test/' : ''

    for (const file of files) {
        const key = `${prefix}conversations/${conversation.id}/uploads/${Date.now()}-${randomUUID()}.${file.type ? extension(file.type) || 'bin' : 'bin'}`
        const url = await storageUpload(key, file.data, file.type)

        const attachment = await prisma.conversationAttachment.create({
            data: {
                conversationId: conversation.id,
                key,
                mimeType: file.type || 'application/octet-stream',
                size: file.data.length || 0,
            },
        })

        parts.push({
            mediaType: attachment.mimeType,
            type: 'file',
            url,
        })
    }

    await prisma.conversationMessage.create({
        data: {
            conversationId: conversation.id,
            parts: [
                ...(parts as any),
                {
                    text: prompt,
                    type: 'text',
                },
            ],
            role: 'user',
        },
    })

    return { conversationId: conversation.id }
})
