export default defineEventHandler(() => {
    return {
        commit: process.env.CAPROVER_GIT_COMMIT_SHA || 'dev',
    }
})
