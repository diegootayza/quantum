import { z } from 'zod'

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
