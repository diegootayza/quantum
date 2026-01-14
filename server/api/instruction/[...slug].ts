import { createRouter, defineEventHandler, useBase } from 'h3'
import { extension } from 'mime-types'

const router = createRouter()

router.get(
    '/:id',
    defineEventHandler(async (event) => {
        const id = getRouterParam(event, 'id')

        const instruction = await prisma.instruction.findUnique({
            include: {
                files: {
                    select: {
                        id: true,
                        key: true,
                        mimeType: true,
                        size: true,
                    },
                },
            },
            where: { id },
        })

        if (!instruction) throw createError({ statusCode: 404, statusMessage: 'Instrucción no encontrada.' })

        const existingFiles = instruction.files.map((f) => ({
            id: f.id,
            key: f.key,
            mimeType: f.mimeType,
            size: f.size,
            url: f.key ? `${process.env.R2_URL}/${f.key}` : null,
        }))

        const { files: _files, ...instructionWithoutFiles } = instruction

        return {
            ...instructionWithoutFiles,
            existingFiles,
        }
    })
)

router.get(
    '/list',
    defineEventHandler(async () => {
        const instructions = await prisma.instruction.findMany()

        return instructions
    })
)

router.post(
    '/',
    defineEventHandler(async (event) => {
        const formData = await readMultipartFormData(event)
        if (!formData) throw createError({ statusCode: 400, statusMessage: 'No se proporcionaron datos del formulario.' })

        const files = formData.filter((p) => p.name === 'files')
        const content = formData.find((p) => p.name === 'content')?.data.toString() || ''
        const description = formData.find((p) => p.name === 'description')?.data.toString() || ''
        const name = formData.find((p) => p.name === 'name')?.data.toString() || ''

        const instruction = await prisma.instruction.create({
            data: { content, description, name },
        })

        for await (const file of files) {
            const instructionFile = await prisma.instructionFile.create({
                data: {
                    instructionId: instruction.id,
                    mimeType: file.type || 'application/octet-stream',
                    size: file.data.length || 0,
                },
            })

            const key = `instructions/${instruction.id}/${instructionFile.id}.${extension(instructionFile.mimeType) || 'bin'}`

            await storageUpload(key, file.data, instructionFile.mimeType)

            await prisma.instructionFile.update({
                data: { key },
                where: { id: instructionFile.id },
            })
        }

        return instruction
    })
)

router.patch(
    '/:id',
    defineEventHandler(async (event) => {
        const id = getRouterParam(event, 'id')

        const formData = await readMultipartFormData(event)
        if (!formData) throw createError({ statusCode: 400, statusMessage: 'No se proporcionaron datos del formulario.' })

        const files = formData.filter((p) => p.name === 'files')
        const active = formData.find((p) => p.name === 'active')?.data.toString() === 'true'
        const content = formData.find((p) => p.name === 'content')?.data.toString()
        const description = formData.find((p) => p.name === 'description')?.data.toString()
        const name = formData.find((p) => p.name === 'name')?.data.toString()

        const instruction = await prisma.instruction.update({
            data: { active, content, description, name },
            where: { id },
        })

        if (files.length > 0) {
            const previousFiles = await prisma.instructionFile.findMany({
                select: { id: true, key: true },
                where: { instructionId: id },
            })

            await Promise.all(
                previousFiles
                    .filter((f) => !!f.key)
                    .map(async (f) => {
                        try {
                            await storageDelete(f.key!)
                        } catch {
                            // Best-effort: si el objeto no existe o falla el borrado, igual borramos el registro en DB.
                        }
                    })
            )

            await prisma.instructionFile.deleteMany({
                where: { instructionId: id },
            })

            for await (const file of files) {
                const instructionFile = await prisma.instructionFile.create({
                    data: {
                        instructionId: instruction.id,
                        mimeType: file.type || 'application/octet-stream',
                        size: file.data.length || 0,
                    },
                })

                const key = `instructions/${instruction.id}/${instructionFile.id}.${extension(instructionFile.mimeType) || 'bin'}`

                await storageUpload(key, file.data, instructionFile.mimeType)

                await prisma.instructionFile.update({
                    data: { key },
                    where: { id: instructionFile.id },
                })
            }
        }

        return instruction
    })
)

router.delete(
    '/:id',
    defineEventHandler(async (event) => {
        const id = getRouterParam(event, 'id')

        const instruction = await prisma.instruction.findUnique({ select: { id: true }, where: { id } })
        if (!instruction) throw createError({ statusCode: 404, statusMessage: 'Instrucción no encontrada.' })

        const previousFiles = await prisma.instructionFile.findMany({
            select: { key: true },
            where: { instructionId: id },
        })

        await Promise.all(
            previousFiles
                .filter((f) => !!f.key)
                .map(async (f) => {
                    try {
                        await storageDelete(f.key!)
                    } catch {
                        // Best-effort: si el objeto no existe o falla el borrado, igual continuamos.
                    }
                })
        )

        await prisma.$transaction([prisma.instructionFile.deleteMany({ where: { instructionId: id } }), prisma.instruction.delete({ where: { id } })])

        return { id }
    })
)

export default useBase('/api/instruction/dashboard', router.handler)
