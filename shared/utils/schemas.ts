import { z } from 'zod'

export const categorySchema = z.object({
    active: z.boolean().optional().default(true),
    name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
})

export type CategorySchema = z.output<typeof categorySchema>

export const conversationSchema = z.object({
    active: z.boolean().optional().default(true),
    name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
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

export const userSchema = z.object({
    active: z.boolean().optional().default(false),
    email: z.email('El email debe ser válido').min(1, 'El email es requerido').default(''),
    name: z.string().min(1, 'El nombre es requerido'),
    password: z.string().min(1, 'La contraseña es requerida'),
    role: z.enum(['ADMIN', 'USER']).optional().default('USER'),
    surname: z.string().min(1, 'El apellido es requerido'),
})

export type UserSchema = z.output<typeof userSchema>
