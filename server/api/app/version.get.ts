export default defineEventHandler(() => {
    const commit = useRuntimeConfig().public.appVersion

    return {
        commit,
    }
})
