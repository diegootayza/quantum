import type { AsyncDataOptions } from '#app'

export function useApiListData<N extends ApiDataType>(name: N, { params, ...options } = {} as { params?: RecordType } & AsyncDataOptions<ApiResponseList<N>>) {
    const axios = useAxios()

    return useAsyncData<ApiResponseList<N>>(
        name,
        async () => {
            const { data } = await axios.get<ApiResponseList<N>>(`/api/${name}/list`, { params })
            return data
        },
        options,
    )
}
