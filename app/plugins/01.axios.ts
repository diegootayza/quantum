import type { InternalAxiosRequestConfig } from 'axios'

import Axios, { AxiosError } from 'axios'

export default defineNuxtPlugin({
    name: 'axios-plugin',
    parallel: true,
    setup() {
        const config = useRuntimeConfig()
        const event = useRequestEvent()

        const { accessToken, clearDataStore, setAccessToken } = useData()

        const axios = Axios.create({
            adapter: 'fetch',
            baseURL: config.public.connectUrl,
            withCredentials: true,
        })

        const raw = Axios.create({
            adapter: 'fetch',
            baseURL: config.public.connectUrl,
            withCredentials: true,
        })

        const toast = import.meta.client ? useToast() : null

        axios.interceptors.request.use((request) => {
            if (import.meta.server) {
                const cookie = event?.node.req.headers.cookie
                if (cookie) request.headers?.set?.('cookie', cookie)
            }

            if (accessToken.value) request.headers?.set?.('authorization', `Bearer ${accessToken.value}`)
            return request
        })

        axios.interceptors.response.use(
            (response) => response,
            async (error) => {
                if (!(error instanceof AxiosError)) return Promise.reject(error)

                const request = error.config as { _retry?: boolean } & InternalAxiosRequestConfig
                const is401 = error.response?.status === 401
                const isAuthRefresh = request.url?.includes('/api/auth/refresh')
                const hasAuthAccess = !!accessToken.value

                if (!is401) toast?.add({ color: 'error', title: error.response?.data?.message || 'Error desconocido' })

                if (!hasAuthAccess) return Promise.reject(error)

                if (is401 && !request._retry && !isAuthRefresh) {
                    request._retry = true

                    try {
                        const { data } = await raw.post<string>('/api/auth/refresh')
                        setAccessToken(data)
                        request.headers?.set?.('authorization', `Bearer ${data}`)
                        return axios(request)
                    } catch {
                        await raw.post<API.OkResponse>('/api/auth/signout').catch(() => null)
                        clearDataStore()
                        if (import.meta.client) navigateTo({ name: 'auth-signin' })
                    }
                }

                return Promise.reject(error)
            },
        )

        return {
            provide: {
                axios,
            },
        }
    },
})
