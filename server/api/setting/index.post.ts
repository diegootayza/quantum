export default defineEventHandler(async (event) => {
    return processError(async () => {
        const { namespace, value } = await readValidatedBody(event, settingSchema.parse)
        return await prisma.setting.upsert({
            create: { namespace, value },
            update: { value },
            where: { namespace },
        })
    })
})
