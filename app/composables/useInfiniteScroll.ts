type UseInfiniteScrollProps = {
    endpoint: string
    key: string
    limit: number
    query?: RecordType
}

export function useInfiniteScroll<T>(props: UseInfiniteScrollProps) {
    const axios = useAxios()

    const route = useRoute()

    const docs = shallowRef<T[]>([])

    const cursor = ref<null | string>(null)
    const ready = ref(false)
    const streaming = ref(false)

    const params = computed(() => {
        return {
            ...(props.query ?? {}),
            limit: props.limit,
            search: route.query.search,
        }
    })

    async function initialValues(data?: API.ResponseList<T>) {
        if (data) {
            docs.value = data.docs
            cursor.value = data.meta.nextCursor
            ready.value = !!cursor.value
        }
    }

    async function loadMore() {
        if (streaming.value || !ready.value) return

        streaming.value = true

        try {
            const { data } = await axios.get<API.ResponseList<T>>(props.endpoint, {
                params: {
                    ...params.value,
                    cursor: cursor.value ?? undefined,
                },
            })

            docs.value = [...docs.value, ...data.docs]
            cursor.value = data.meta.nextCursor
            ready.value = !!cursor.value
        } finally {
            streaming.value = false
        }
    }

    async function reset() {
        await refreshNuxtData(props.key)
        cursor.value = null
        docs.value = []
        ready.value = false
        streaming.value = false
    }

    watch(
        () => route.query.search,
        () => reset(),
    )

    return {
        docs,
        endpoint: props.endpoint,
        initialValues,
        key: props.key,
        loadMore,
        params,
        reset,
    }
}
