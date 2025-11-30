export default defineNuxtRouteMiddleware(async () => {
    const { user } = useUserSession()

    if (!user.value?.active) return navigateTo({ name: 'profile' })
})
