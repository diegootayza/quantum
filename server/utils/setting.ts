export async function getSettingValue<T = unknown>(name: string, namespace: string) {
    const doc = await prisma.setting.findUnique({
        select: { value: true },
        where: { namespace_name: { name, namespace } },
    })

    return doc?.value as T | undefined
}
