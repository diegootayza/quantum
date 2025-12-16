interface CheckCreditsOptions {
    amount: number
    userId: string
}

interface ConsumeCreditsOptions {
    amount: number
    description: string
    metadata?: Record<string, unknown>
    userId: string
}

interface GrantCreditsOptions {
    amount: number
    description: string
    metadata?: Record<string, unknown>
    type?: 'BONUS' | 'REFUND' | 'SUBSCRIPTION_GRANT'
    userId: string
}

/**
 * Check if user has enough credits without consuming them
 */
export async function checkCredits(options: CheckCreditsOptions): Promise<boolean> {
    const { amount, userId } = options

    const user = await prisma.user.findUnique({
        select: { credits: true },
        where: { id: userId },
    })

    if (!user) {
        return false
    }

    return user.credits >= amount
}

/**
 * Consume credits from a user's account
 * @throws Error if user doesn't have enough credits
 */
export async function consumeCredits(options: ConsumeCreditsOptions) {
    const { amount, description, metadata = {}, userId } = options

    // Get current user credits
    const user = await prisma.user.findUnique({
        select: { credits: true },
        where: { id: userId },
    })

    if (!user) {
        throw new Error('Usuario no encontrado')
    }

    // Check if user has enough credits
    if (user.credits < amount) {
        throw new Error(`Créditos insuficientes. Tienes ${user.credits} créditos, necesitas ${amount}`)
    }

    const newBalance = user.credits - amount

    // Create transaction and update user credits atomically
    const [transaction] = await prisma.$transaction([
        prisma.creditTransaction.create({
            data: {
                amount: -amount, // Negative for consumption
                balanceAfter: newBalance,
                description,
                metadata,
                type: 'CONSUMPTION',
                userId,
            },
        }),
        prisma.user.update({
            data: { credits: newBalance },
            where: { id: userId },
        }),
    ])

    return {
        newBalance,
        transaction,
    }
}

/**
 * Grant credits to a user (for bonuses, refunds, or subscription grants)
 */
export async function grantCredits(options: GrantCreditsOptions) {
    const { amount, description, metadata = {}, type = 'BONUS', userId } = options

    const user = await prisma.user.findUnique({
        select: { credits: true },
        where: { id: userId },
    })

    if (!user) {
        throw new Error('Usuario no encontrado')
    }

    const newBalance = user.credits + amount

    const [transaction] = await prisma.$transaction([
        prisma.creditTransaction.create({
            data: {
                amount,
                balanceAfter: newBalance,
                description,
                metadata,
                type,
                userId,
            },
        }),
        prisma.user.update({
            data: { credits: newBalance },
            where: { id: userId },
        }),
    ])

    return {
        newBalance,
        transaction,
    }
}
