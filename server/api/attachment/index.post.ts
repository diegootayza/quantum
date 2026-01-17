import { extension } from 'mime-types'
import { randomUUID } from 'node:crypto'

export default defineEventHandler(async (event) => {
    const { secure } = await requireUserSession(event)

    if (!secure?.id) {
        throw createError({ statusCode: 401, statusMessage: 'No autorizado.' })
    }

    const formData = await readMultipartFormData(event)

    if (!formData) {
        throw createError({ statusCode: 400, statusMessage: 'No se recibieron archivos.' })
    }

    const conversationId = formData.find((f) => f.name === 'conversationId')?.data.toString()
    const files = formData.filter((f) => f.name === 'files' && f.type?.startsWith('image/'))

    if (files.length === 0) {
        throw createError({ statusCode: 400, statusMessage: 'No se recibieron imágenes válidas.' })
    }

    if (!conversationId) {
        throw createError({ statusCode: 400, statusMessage: 'Se requiere el ID de la conversación.' })
    }

    const results = []

    const prefix = import.meta.dev ? 'test/' : ''

    for (const file of files) {
        const key = `${prefix}conversations/${conversationId}/uploads/${Date.now()}-${randomUUID()}.${file.type ? extension(file.type) || 'bin' : 'bin'}`
        const url = await storageUpload(key, file.data, file.type)

        const attachment = await prisma.conversationAttachment.create({
            data: {
                conversationId,
                key,
                mimeType: file.type || 'application/octet-stream',
                size: file.data.length,
            },
        })

        results.push({
            mediaType: attachment.mimeType,
            type: 'file' as const,
            url,
        })
    }

    return results
})
