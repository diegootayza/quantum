export default defineEventHandler(async (event) => {
    const { name, namespace, value } = await readValidatedBody(event, settingSchema.parse)

    const response = await prisma.setting.upsert({
        create: { name, namespace, value },
        update: { value },
        where: { namespace_name: { name, namespace } },
    })

    return response
})
