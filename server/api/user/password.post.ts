import { z } from 'zod'

const schema = z.object({
    currentPassword: z.string().min(8, 'Debe tener al menos 8 caracteres'),
    newPassword: z.string().min(8, 'Debe tener al menos 8 caracteres'),
})

export default defineEventHandler(async (event) => {
    const { secure } = await requireUserSession(event)
    const result = await readValidatedBody(event, (v) => schema.safeParse(v))

    if (!result.success) throw result.error.issues

    // Get current user with password
    const currentUser = await prisma.user.findUnique({
        select: { password: true },
        where: { id: secure!.id },
    })

    if (!currentUser) {
        throw createError({
            message: 'Usuario no encontrado',
            statusCode: 404,
        })
    }

    // Verify current password
    const isValidPassword = await verifyPassword(currentUser.password, result.data.currentPassword)

    if (!isValidPassword) {
        throw createError({
            message: 'La contraseña actual es incorrecta',
            statusCode: 401,
        })
    }

    // Hash new password
    const hashedPassword = await hashPassword(result.data.newPassword)

    // Update password
    await prisma.user.update({
        data: { password: hashedPassword },
        where: { id: secure!.id },
    })

    return { message: 'Contraseña actualizada correctamente', success: true }
})
