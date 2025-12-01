import type { UIMessage } from 'ai'

import { extension } from 'mime-types'

export default defineEventHandler(async (event) => {
    const { secure } = await getUserSession(event)
    const formData = await readMultipartFormData(event)
    if (!formData) throw createError({ statusCode: 400, statusMessage: 'No form data provided' })

    const files = formData.filter((p) => p.name === 'files')
    const conversationId = formData.find((p) => p.name === 'conversationId')?.data.toString()

    const parts: UIMessage['parts'] = []

    for await (const file of files) {
        const attachment = await prisma.attachment.create({
            data: {
                conversationId,
                mimeType: file.type || 'application/octet-stream',
                size: file.data.length || 0,
                userId: secure!.id,
            },
        })

        const r2Key = `conversations/${conversationId}/${attachment.id}.${extension(attachment.mimeType) || 'bin'}`

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

    return parts
})
