import { z } from 'zod'

export const genericSchema = z.object({})

export type GenericSchema = z.output<typeof genericSchema>

export const paramIdSchema = z.object({
    id: z.string().min(1, 'El ID es requerido'),
})

export type ParamIdSchema = z.output<typeof paramIdSchema>

export const modelSchema = z.object({
    active: z.boolean().optional().default(true),
    label: z.string().min(2, 'El label debe tener al menos 2 caracteres'),
    value: z.string().min(2, 'El valor debe tener al menos 2 caracteres'),
})

export type ModelSchema = z.output<typeof modelSchema>

export const categorySchema = z.object({
    active: z.boolean().optional().default(true),
    name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
})

export type CategorySchema = z.output<typeof categorySchema>

export const conversationSchema = z.object({
    instructionId: z.string().min(1, 'El ID de instrucción es requerido').nullable(),
    name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
    userId: z.string().min(1, 'El ID de usuario es requerido'),
})

export type ConversationSchema = z.output<typeof conversationSchema>

export const instructionSchema = z.object({
    active: z.boolean().optional().default(true),
    categoryId: z.string().min(1, 'La categoría es requerida'),
    content: z.string().min(1, 'El contenido es requerido'),
    description: z.string().min(5, 'La descripción debe tener al menos 5 caracteres'),
    name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
})

export type InstructionSchema = z.output<typeof instructionSchema>

export const settingSchema = z.object({
    name: z.string().min(1, 'El nombre debe tener al menos 1 carácter'),
    namespace: z.string().min(1, 'El namespace debe tener al menos 1 carácter'),
    value: z.any(),
})

export type SettingSchema = z.output<typeof settingSchema>

export const serviceSchema = z.object({
    active: z.boolean().optional().default(true),
    description: z.string().min(1, 'La descripción es requerida'),
    name: z.string().min(1, 'El nombre es requerido'),
})

export type ServiceSchema = z.output<typeof serviceSchema>

export const subscriptionSchema = z.object({
    active: z.boolean().optional().default(true),
    currency: z.string().default('USD'),
    description: z.string().min(1, 'La descripción es requerida'),
    features: z.array(z.string()).min(1, 'Debe tener al menos una característica'),
    imageGenerationLimit: z.number().min(0, 'El límite debe ser mayor o igual a 0').default(0),
    interval: z.enum(['MONTHLY', 'YEARLY']),
    name: z.string().min(1, 'El nombre es requerido'),
    price: z.number().min(0, 'El precio debe ser mayor o igual a 0'),
    serviceIds: z.array(z.string()).optional(),
    stripeId: z.string().nullable(),
})

export type SubscriptionSchema = z.output<typeof subscriptionSchema>

export const userSchema = z.object({
    active: z.boolean().optional(),
    email: z.email('El email debe ser válido').min(1, 'El email es requerido').optional(),
    name: z.string().min(1, 'El nombre es requerido'),
    role: z.enum(['ADMIN', 'USER']).optional(),
    serviceIds: z.array(z.string()).optional(),
    subscriptionId: z.string().nullable().optional(),
    surname: z.string().min(1, 'El apellido es requerido'),
})

export type UserSchema = z.output<typeof userSchema>

export const creditPackageSchema = z.object({
    active: z.boolean().optional().default(true),
    bonusCredits: z.number().min(0, 'Los créditos bonus deben ser mayor o igual a 0').default(0),
    credits: z.number().min(1, 'Los créditos deben ser mayor a 0'),
    currency: z.string().default('USD'),
    description: z.string().min(1, 'La descripción es requerida'),
    name: z.string().min(1, 'El nombre es requerido'),
    price: z.number().min(0, 'El precio debe ser mayor o igual a 0'),
    stripePriceId: z.string().nullable().optional(),
    stripeProductId: z.string().nullable().optional(),
})

export type CreditPackageSchema = z.output<typeof creditPackageSchema>

export const creditTransactionSchema = z.object({
    amount: z.number(),
    balanceAfter: z.number(),
    creditPackageId: z.string().nullable().optional(),
    description: z.string(),
    metadata: z.any().optional(),
    type: z.enum(['PURCHASE', 'CONSUMPTION', 'REFUND', 'BONUS', 'SUBSCRIPTION_GRANT']),
    userId: z.string(),
})

export type CreditTransactionSchema = z.output<typeof creditTransactionSchema>

export const purchaseCreditsSchema = z.object({
    creditPackageId: z.string().min(1, 'El ID del paquete es requerido'),
})

export type PurchaseCreditsSchema = z.output<typeof purchaseCreditsSchema>

export const consumeCreditsSchema = z.object({
    amount: z.number().min(1, 'La cantidad debe ser mayor a 0'),
    description: z.string().min(1, 'La descripción es requerida'),
    metadata: z.any().optional(),
})

export type ConsumeCreditsSchema = z.output<typeof consumeCreditsSchema>
