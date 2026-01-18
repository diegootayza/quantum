export default defineEventHandler(() => {
    const commit = useRuntimeConfig().public.commit

    return {
        commit,
    }
})
