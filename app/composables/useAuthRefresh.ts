/**
 * Composable para manejar automáticamente la renovación del refresh token
 * Se ejecuta en el cliente y detecta cuando la sesión está por expirar
 * para renovarla sin interrumpir la experiencia del usuario
 */

const REFRESH_INTERVAL = 24 * 60 * 60 * 1000 // 24 horas - renueva 6 horas antes de los 30 días

export const useAuthRefresh = () => {
    const refreshToken = useState<null | string>('auth.refreshToken', () => null)
    const refreshTimer = useState<NodeJS.Timeout | null>('auth.refreshTimer', () => null)

    /**
     * Almacena el refresh token en el estado
     */
    const setRefreshToken = (token: null | string) => {
        refreshToken.value = token
        // Guardar en localStorage como backup
        if (import.meta.client) {
            if (token) {
                localStorage.setItem('refreshToken', token)
            } else {
                localStorage.removeItem('refreshToken')
            }
        }
    }

    /**
     * Recupera el refresh token almacenado
     */
    const getRefreshToken = (): null | string => {
        if (refreshToken.value) return refreshToken.value

        if (import.meta.client) {
            const stored = localStorage.getItem('refreshToken')
            if (stored) {
                refreshToken.value = stored
                return stored
            }
        }

        return null
    }

    /**
     * Realiza la solicitud de refresh
     */
    const performRefresh = async (): Promise<boolean> => {
        try {
            const token = getRefreshToken()
            if (!token) return false

            const response = await $fetch<{ refreshToken: string }>('/api/auth/refresh', {
                body: { refreshToken: token },
                method: 'POST',
            })

            if (response.refreshToken) {
                setRefreshToken(response.refreshToken)
                scheduleRefresh()
                return true
            }

            return false
        } catch (error) {
            console.error('Error refrescando token:', error)
            // Si falla, limpiar el token y redirigir a login
            setRefreshToken(null)
            return false
        }
    }

    /**
     * Programa la siguiente renovación
     */
    const scheduleRefresh = () => {
        clearRefreshTimer()

        if (import.meta.client) {
            refreshTimer.value = setTimeout(() => {
                performRefresh()
            }, REFRESH_INTERVAL)
        }
    }

    /**
     * Limpia el timer de renovación
     */
    const clearRefreshTimer = () => {
        if (refreshTimer.value) {
            clearTimeout(refreshTimer.value)
            refreshTimer.value = null
        }
    }

    /**
     * Inicializa el sistema de refresh
     * Se debe llamar cuando el usuario se autentica
     */
    const initializeRefresh = (token: string) => {
        setRefreshToken(token)
        scheduleRefresh()
    }

    /**
     * Limpia el sistema de refresh
     * Se debe llamar cuando el usuario cierra sesión
     */
    const cleanup = () => {
        setRefreshToken(null)
        clearRefreshTimer()
    }

    // Limpiar al desmontar (solo si hay contexto de componente activo)
    if (getCurrentInstance()) {
        onBeforeUnmount(() => {
            cleanup()
        })
    }

    return {
        cleanup,
        getRefreshToken,
        initializeRefresh,
        performRefresh,
        refreshToken,
        setRefreshToken,
    }
}
