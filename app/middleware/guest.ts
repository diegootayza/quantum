export default defineNuxtRouteMiddleware(async () => {
    const { fetch, loggedIn } = useUserSession()

    await fetch()

    if (loggedIn.value) return navigateTo({ name: 'dashboard' })
})
