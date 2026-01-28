export function useConnect() {
    const config = useRuntimeConfig()
    const connectUrl = config.public.connectUrl

    async function fetcher<T = unknown>(endpoint: string, options?: RequestInit) {
        const response = await fetch(`${connectUrl}/${endpoint}`, options)
        return (await response.json()) as T
    }

    return {
        fetcher,
    }
}
