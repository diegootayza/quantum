import z from 'zod'

export const createFileSchema = z.object({
    files: z.array(z.file()).min(1, 'Se requiere al menos un archivo'),
    path: z.string().min(1, 'La ruta es requerida').trim(),
    type: z.string().min(1, 'El tipo es requerido').trim(),
    userId: z.string().optional(),
})

export const updateFileSchema = createFileSchema.partial()

export type CreateFileSchema = z.output<typeof createFileSchema>
export type UpdateFileSchema = z.output<typeof updateFileSchema>
