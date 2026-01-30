export default defineNuxtPlugin(() => {
    const commit = useRuntimeConfig().public.appVersion

    const toast = useToast()

    function checkUpdateAvailable() {
        setTimeout(async () => {
            try {
                const res = await $fetch('/api/app/version', { method: 'GET' })

                if (res.commit && res.commit !== commit) {
                    toast.add({
                        actions: [
                            {
                                label: 'Recargar',
                                onClick: () => {
                                    window.location.reload()
                                },
                            },
                        ],
                        color: 'info',
                        description: 'Recarga la página para actualizar a la última versión.',
                        duration: 10000,
                        title: 'Nueva versión disponible',
                    })
                }
            } catch {
                toast.add({
                    color: 'error',
                    description: 'No se pudo comprobar si hay una nueva versión disponible.',
                    title: 'Error al comprobar actualizaciones',
                })
            }
        }, 1000)
    }

    if (import.meta.client) {
        checkUpdateAvailable()
        setInterval(checkUpdateAvailable, 600_000)
    }
})
