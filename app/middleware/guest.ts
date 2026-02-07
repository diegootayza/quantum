export default defineNuxtRouteMiddleware(async () => {
    const { isAuthenticated } = useData()
    if (isAuthenticated.value) return navigateTo({ name: 'profile' })
})
