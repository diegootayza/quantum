export interface ConfirmModalOptions {
    confirmButtonLabel?: string
    description?: string
    onCancel?: () => void
    onConfirm: () => Promise<void> | void
    title?: string
}

export function useConfirmModal() {
    const isOpen = useState('confirmModal:isOpen', () => false)
    const loading = useState('confirmModal:loading', () => false)
    const options = useState<ConfirmModalOptions | null>('confirmModal:options', () => null)

    const open = (modalOptions: ConfirmModalOptions) => {
        options.value = modalOptions
        isOpen.value = true
    }

    const close = () => {
        isOpen.value = false
        loading.value = false
        if (options.value?.onCancel) {
            options.value.onCancel()
        }
        options.value = null
    }

    const confirm = async () => {
        if (!options.value?.onConfirm) return

        loading.value = true
        try {
            await options.value.onConfirm()
            isOpen.value = false
            options.value = null
        } catch (error) {
            console.error('Error in confirm action:', error)
            throw error
        } finally {
            loading.value = false
        }
    }

    return {
        close,
        confirm,
        isOpen,
        loading,
        open,
        options,
    }
}
