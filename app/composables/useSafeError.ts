export function useSafeError() {
    const toast = useToast()

    async function safeExecute<T>(fn: () => Promise<T> | T) {
        try {
            return await fn()
        } catch (error: any) {
            toast.add({ color: 'error', title: error?.data?.message || 'Error' })
        }
    }

    return {
        safeExecute,
    }
}
