export default defineNuxtRouteMiddleware(async () => {
    const { user } = useData()
    if (!user.value?.active) return navigateTo({ name: 'profile' })
})
