import { createRouter, defineEventHandler, useBase } from 'h3'

const router = createRouter()

router.get(
    '/:id',
    defineEventHandler(async (event) => {
        try {
            const id = getRouterParam(event, 'id')

            return await prisma.instruction.findUniqueOrThrow({
                where: { id },
            })
        } catch {
            throw createError({ statusCode: 404, statusMessage: 'Instrucción no encontrada.' })
        }
    }),
)

router.get(
    '/list',
    defineEventHandler(async () => {
        const instructions = await prisma.instruction.findMany()

        return instructions
    }),
)

router.post(
    '/',
    defineEventHandler(async (event) => {
        const formData = await readMultipartFormData(event)
        if (!formData) throw createError({ statusCode: 400, statusMessage: 'No se proporcionaron datos del formulario.' })

        const content = formData.find((p) => p.name === 'content')?.data.toString() || ''
        const description = formData.find((p) => p.name === 'description')?.data.toString() || ''
        const name = formData.find((p) => p.name === 'name')?.data.toString() || ''

        const instruction = await prisma.instruction.create({
            data: { content, description, name },
        })

        return instruction
    }),
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

        return instruction
    }),
)

router.delete(
    '/:id',
    defineEventHandler(async (event) => {
        const id = getRouterParam(event, 'id')

        const instruction = await prisma.instruction.findUnique({ select: { id: true }, where: { id } })
        if (!instruction) throw createError({ statusCode: 404, statusMessage: 'Instrucción no encontrada.' })

        return { id }
    }),
)

export default useBase('/api/instruction/dashboard', router.handler)
