import { z } from 'zod'

export type CategorySchema = z.output<typeof categorySchema>
export type ChatAgentSchema = z.output<typeof chatAgentSchema>
export type ChatMessageSchema = z.output<typeof chatMessageSchema>
export type ChatSchema = z.output<typeof chatSchema>
export type ConversationSchema = z.output<typeof conversationSchema>
export type InstructionSchema = z.output<typeof instructionSchema>
export type ModelSchema = z.output<typeof modelSchema>
export type PromptSchema = z.output<typeof promptSchema>
export type SettingSchema = z.output<typeof settingSchema>
export type UserSchema = z.output<typeof userSchema>

export const modelSchema = z.object({
    active: z.boolean().optional().default(true),
    name: z.string().min(1, 'El nombre debe tener al menos 1 carácter'),
    roles: z.array(z.string().min(1, 'El rol debe tener al menos 1 carácter')),
    value: z.string().min(1, 'El valor debe tener al menos 1 carácter'),
})

export const chatSchema = z.object({
    agentId: z.string().min(1, 'El ID de agente es requerido'),
    name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
    userId: z.string().min(1, 'El ID de usuario es requerido'),
})

export const chatAgentSchema = z.object({
    active: z.boolean().optional().default(true),
    description: z.string().min(5, 'La descripción debe tener al menos 5 caracteres'),
    instruction: z.string().min(1, 'La instrucción es requerida'),
    model: z.string().min(1, 'El modelo es requerido'),
    name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
})

export const chatMessageSchema = z.object({
    chatId: z.string().min(1, 'El ID de chat es requerido'),
    parts: z.array(z.any()),
    role: z.string().min(1, 'El rol es requerido'),
})

export const categorySchema = z.object({
    active: z.boolean().optional().default(true),
    name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
})

export const conversationSchema = z.object({
    instructionId: z.string().min(1, 'El ID de instrucción es requerido').nullable(),
    name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
    userId: z.string().min(1, 'El ID de usuario es requerido'),
})

export const instructionSchema = z.object({
    active: z.boolean().optional().default(true),
    content: z.string().min(1, 'El contenido es requerido'),
    description: z.string().min(5, 'La descripción debe tener al menos 5 caracteres'),
    name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
})

export const settingSchema = z.object({
    name: z.string().min(1, 'El nombre debe tener al menos 1 carácter'),
    namespace: z.string().min(1, 'El namespace debe tener al menos 1 carácter'),
    value: z.any(),
})

export const promptSchema = z.object({
    description: z.string().min(1, 'La descripción debe tener al menos 1 carácter'),
    key: z.string().min(1, 'El key debe tener al menos 1 carácter'),
    value: z.string().min(1, 'El valor debe tener al menos 1 carácter'),
})

export const userSchema = z.object({
    active: z.boolean().optional(),
    email: z.email('El email debe ser válido').min(1, 'El email es requerido').optional(),
    name: z.string().min(1, 'El nombre es requerido'),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres').optional(),
    role: z.enum(['ADMIN', 'USER']).optional(),
    surname: z.string().min(1, 'El apellido es requerido'),
})
