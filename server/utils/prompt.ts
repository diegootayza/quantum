export async function getPromptByKey(key: string) {
    try {
        const prompt = await prisma.prompt.findUnique({
            select: {
                value: true,
            },
            where: { key },
        })

        return prompt?.value || ''
    } catch {
        return ''
    }
}
