type Options = {
    enabled?: () => boolean
    message?: string
    onCancel?: () => Promise<void> | void
    onConfirm?: () => Promise<void> | void
}

export function useLeavePrevent(options: Options = {}) {
    const message = options.message ?? 'Tienes cambios sin guardar. ¿Seguro que quieres salir?'
    const enabled = options.enabled ?? (() => true)
    const onCancel = options.onCancel
    const onConfirm = options.onConfirm

    const isDirty = ref(false)

    onBeforeRouteLeave(async (_to, _from, next) => {
        if (!enabled() || !isDirty.value) return next()
        const ok = window.confirm(message)

        if (!ok) {
            await onCancel?.()
            return next(false)
        }

        await onConfirm?.()
        next()
    })

    const onBeforeUnload = (e: BeforeUnloadEvent) => {
        if (!enabled() || !isDirty.value) return
        e.preventDefault()
        e.returnValue = ''
    }

    onMounted(() => window.addEventListener('beforeunload', onBeforeUnload))
    onBeforeUnmount(() => window.removeEventListener('beforeunload', onBeforeUnload))

    const markDirty = () => (isDirty.value = true)
    const markClean = () => (isDirty.value = false)

    return { isDirty, markClean, markDirty }
}
