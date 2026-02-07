export default defineNuxtPlugin({
    dependsOn: ['axios-plugin'],
    name: 'auth-plugin',
    async setup() {
        const request = useRequestEvent()
        const { clearDataStore, setAccessToken, setUser, user } = useData()
        const { $axios } = useNuxtApp()

        const cookie = request?.node.req.headers.cookie || ''
        const hasRefresh = cookie.includes('refresh-token=')

        if (!hasRefresh) return

        if (user.value) return

        try {
            const { data } = await $axios.get<API.AuthUserResponse>(API_ENDPOINT.AUTH_USER)
            setUser(data)
            return
        } catch (error: any) {
            if (error?.response?.status !== 401) return
        }

        try {
            const { data: a } = await $axios.post<string>(API_ENDPOINT.AUTH_REFRESH)
            setAccessToken(a)
            const { data: b } = await $axios.get<API.AuthUserResponse>(API_ENDPOINT.AUTH_USER)
            setUser(b)
        } catch {
            clearDataStore()
        }
    },
})
