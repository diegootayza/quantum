export default defineNuxtRouteMiddleware(async () => {
    const { user } = useUserSession()

    if (user.value?.role !== 'ADMIN') return navigateTo({ name: 'profile' })
})
