export function useAuth() {
    const axios = useAxios()
    const { clearDataStore, setAccessToken, setUser } = useData()

    async function getUser(navigate?: boolean) {
        const user = await axiosSafeData<API.AuthUserResponse>(axios.get<API.AuthUserResponse>('/api/auth/user'))
        if (!user) return
        setUser(user)
        if (navigate) return navigateTo({ name: 'profile' })
    }

    async function signin(data: API.AuthSigninData) {
        const accessToken = await axiosSafeData(axios.post<string>('/api/auth/signin', data))
        if (!accessToken) return
        setAccessToken(accessToken)
        await getUser(true)
    }

    async function signout() {
        const res = await axiosSafeData(axios.post<API.OkResponse>('/api/auth/signout'))
        if (!res?.ok) return
        clearDataStore()
        return navigateTo({ name: 'auth-signin' })
    }

    async function signup(data: API.AuthSignupData) {
        const accessToken = await axiosSafeData(axios.post<string>('/api/auth/signup', data))
        if (!accessToken) return
        setAccessToken(accessToken)
        await getUser(true)
    }

    return {
        getUser,
        signin,
        signout,
        signup,
    }
}
