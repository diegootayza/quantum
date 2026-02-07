import z from 'zod'

export const settingSchema = z.object({
    active: z.boolean().optional(),
    name: z.string().min(1, 'El nombre debe tener al menos 1 carácter'),
    roles: z.array(z.string().min(1, 'El rol debe tener al menos 1 carácter')),
    value: z.string().min(1, 'El valor debe tener al menos 1 carácter'),
})
