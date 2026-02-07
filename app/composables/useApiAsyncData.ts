import type { AsyncDataOptions } from '#app'
import type { AxiosResponse } from 'axios'

export function useApiAsyncData<T>(key: string, handler: () => Promise<AxiosResponse<T>>, options?: AsyncDataOptions<T>) {
    return useAsyncData<T>(
        key,
        async () => {
            const { data } = await handler()
            return data
        },
        options,
    )
}
