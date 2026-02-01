export default defineEventHandler((event) => {
    return processError(async () => {
        try {
            const { secure } = await requireUserSession(event)

            const user = await prisma.user.findUnique({ where: { id: secure?.id } })

            if (user) {
                await replaceUserSession(event, {
                    secure: {
                        id: user.id,
                        role: user.role,
                    },
                    user: {
                        active: user.active,
                        email: user.email,
                        id: user.id,
                        name: user.name,
                        role: user.role,
                        surname: user.surname,
                    },
                })

                return { message: 'Sesión actualizada correctamente' }
            } else {
                return { message: 'Usuario no encontrado' }
            }
        } catch {
            return { message: 'Error al actualizar la sesión' }
        }
    })
})
