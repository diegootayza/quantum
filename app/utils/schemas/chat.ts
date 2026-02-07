import z from 'zod'

export const createChatSchema = z.object({
    agentId: z.string().trim().optional(),
    name: z.string().min(1, 'El nombre es requerido').trim(),
    userId: z.string().min(1, 'El ID de usuario es requerido').trim(),
})

export const updateChatSchema = createChatSchema.partial()

export type CreateChatSchema = z.output<typeof createChatSchema>
export type UpdateChatSchema = z.output<typeof updateChatSchema>
