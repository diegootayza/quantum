export function useAuth() {
    const router = useRouter()
    const { clear, fetch } = useUserSession()
    const { cleanup } = useAuthRefresh()

    async function clearSession() {
        cleanup()

        try {
            await $fetch('/api/auth/logout', { method: 'POST' })
        } catch (error) {
            console.error('Error al cerrar sesión:', error)
        }

        await clear()
        router.push({ name: 'auth-signin' })
    }

    async function updateSession() {
        await $fetch('/api/auth/update', { method: 'GET' })
        await fetch()
    }

    return { clearSession, updateSession }
}
