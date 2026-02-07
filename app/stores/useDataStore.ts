export const useDataStore = defineStore('data-store', () => {
    const accessToken = ref<null | string>(null)
    const user = ref<null | UserData>(null)

    const isAuthenticated = computed(() => !!user.value)

    function clearDataStore() {
        accessToken.value = null
        user.value = null
    }

    function setAccessToken(token: null | string) {
        accessToken.value = token
    }

    function setUser(userData: null | UserData) {
        user.value = userData
    }

    return {
        accessToken,
        clearDataStore,
        isAuthenticated,
        setAccessToken,
        setUser,
        user,
    }
})
