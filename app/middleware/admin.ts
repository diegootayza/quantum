export default defineNuxtRouteMiddleware(async () => {
    const { user } = useData()
    if (user.value?.role !== 'ADMIN') return navigateTo({ name: 'profile' })
})
