export async function getSettingValue<T = unknown>(namespace: string) {
    const doc = await prisma.setting.findUniqueOrThrow({
        select: { value: true },
        where: { namespace },
    })

    return doc.value as T
}
