/**
 * Plugin para inicializar el sistema de refresh token al cargar la app
 * Detecta si hay sesión activa y restaura el refresh token
 */

export default defineNuxtPlugin(async () => {
    const authRefresh = useAuthRefresh()
    const { session } = useUserSession()

    watch(
        () => session.value,
        (newSession) => {
            if (newSession?.user?.id) {
                // Si no hay refresh token almacenado pero sí hay sesión,
                // el usuario debe haber iniciado sesión recientemente
                // No hacemos nada aquí, el composable se inicializa en la página de login
            } else {
                // Sesión cerrada
                authRefresh.cleanup()
            }
        },
    )
})
