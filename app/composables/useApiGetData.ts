import type { AsyncDataOptions } from '#app'

export function useApiGetData<T>(url: string, { params, ...options } = {} as { params?: RecordType } & AsyncDataOptions<T>) {
    const axios = useAxios()

    return useAsyncData<T>(
        url,
        async () => {
            const { data } = await axios.get(url, { params })
            return data
        },
        options,
    )
}
