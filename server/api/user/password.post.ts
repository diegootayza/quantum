import { z } from 'zod'

const schema = z.object({
    currentPassword: z.string().min(8, 'Debe tener al menos 8 caracteres'),
    newPassword: z.string().min(8, 'Debe tener al menos 8 caracteres'),
})

export default defineEventHandler(async (event) => {
    const { user } = await requireUserSession(event)
    const result = await readValidatedBody(event, (v) => schema.safeParse(v))

    if (!result.success) throw result.error.issues

    // Get current user with password
    const currentUser = await prisma.user.findUnique({
        where: { id: user.id },
        select: { password: true }
    })

    if (!currentUser) {
        throw createError({
            statusCode: 404,
            message: 'Usuario no encontrado'
        })
    }

    // Verify current password
    const isValidPassword = await verifyPassword(currentUser.password, result.data.currentPassword)

    if (!isValidPassword) {
        throw createError({
            statusCode: 401,
            message: 'La contraseña actual es incorrecta'
        })
    }

    // Hash new password
    const hashedPassword = await hashPassword(result.data.newPassword)

    // Update password
    await prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword }
    })

    return { success: true, message: 'Contraseña actualizada correctamente' }
})
