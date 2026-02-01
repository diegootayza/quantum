export default defineEventHandler(() => {
    return processError(() => {
        const commit = useRuntimeConfig().public.appVersion

        return {
            commit,
        }
    })
})
