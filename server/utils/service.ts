import type { ImageModelUsage, LanguageModelUsage } from 'ai'

export async function saveError() {}

export async function saveUsageTokens({ model, usage, userId }: { model: string; usage: ImageModelUsage | LanguageModelUsage; userId: string }) {
    try {
        await prisma.usage.create({
            data: {
                inputTokens: usage.inputTokens || 0,
                model,
                outputTokens: usage.outputTokens || 0,
                totalTokens: usage.totalTokens || 0,
                userId,
            },
        })
    } catch (error) {
        console.log('Error saving usage tokens:', error)
    }
}
