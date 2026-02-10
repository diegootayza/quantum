export interface AlertProps {
    onCancel?: () => Promise<void> | void
    onConfirm?: () => Promise<void> | void
}

type AlertState = 'loading' | 'ready'

export function useAlert(props: AlertProps) {
    const cancelStatus = ref<AlertState>('ready')
    const confirmStatus = ref<AlertState>('ready')
    const open = ref(false)

    async function onCancel() {
        if (props.onCancel) {
            cancelStatus.value = 'loading'

            try {
                await props.onCancel()
            } finally {
                cancelStatus.value = 'ready'
                open.value = false
            }
        } else {
            open.value = false
        }
    }

    async function onConfirm() {
        if (props.onConfirm) {
            confirmStatus.value = 'loading'

            try {
                await props.onConfirm()
            } finally {
                confirmStatus.value = 'ready'
                open.value = false
            }
        } else {
            open.value = false
        }
    }

    function onOpen() {
        open.value = true
    }

    return {
        cancelStatus,
        confirmStatus,
        onCancel,
        onConfirm,
        onOpen,
        open,
    }
}
