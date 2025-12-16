import type { UIMessage } from 'ai'

import { extension } from 'mime-types'

import { trackEvent } from '../../utils/analytics/events'

export default defineEventHandler(async (event) => {
    const { secure } = await getUserSession(event)
    const formData = await readMultipartFormData(event)
    if (!formData) throw createError({ statusCode: 400, statusMessage: 'No form data provided' })

    const files = formData.filter((p) => p.name === 'files')
    const instructionId = formData.find((p) => p.name === 'instructionId')?.data.toString()
    const prompt = formData.find((p) => p.name === 'prompt')?.data.toString()

    const conversation = await prisma.conversation.create({
        data: {
            instructionId,
            name: '',
            userId: secure!.id,
        },
    })

    // Track evento de conversación creada
    await trackEvent({
        eventType: 'conversation_created',
        metadata: {
            conversationId: conversation.id,
            hasFiles: files.length > 0,
            instructionId,
        },
        userId: secure!.id,
    })

    const parts: UIMessage['parts'] = []

    for await (const file of files) {
        const attachment = await prisma.attachment.create({
            data: {
                conversationId: conversation.id,
                mimeType: file.type || 'application/octet-stream',
                size: file.data.length || 0,
                userId: secure!.id,
            },
        })

        const r2Key = `conversations/${conversation.id}/${attachment.id}.${extension(attachment.mimeType) || 'bin'}`

        const url = await storageUpload(r2Key, file.data, attachment.mimeType)

        await prisma.attachment.update({
            data: { r2Key, url },
            where: { id: attachment.id },
        })

        parts.push({
            mediaType: attachment.mimeType,
            type: 'file',
            url,
        })
    }

    // Track evento de archivos subidos
    if (files.length > 0) {
        await trackEvent({
            eventType: 'file_uploaded',
            metadata: {
                conversationId: conversation.id,
                count: files.length,
                totalSize: files.reduce((sum, f) => sum + f.data.length, 0),
            },
            userId: secure!.id,
        })
    }

    await prisma.message.create({
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

    // Track evento de mensaje enviado
    await trackEvent({
        eventType: 'message_sent',
        metadata: {
            conversationId: conversation.id,
            hasAttachments: parts.length > 0,
        },
        userId: secure!.id,
    })

    return { conversationId: conversation.id }
})
