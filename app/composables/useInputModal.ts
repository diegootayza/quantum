interface InputModalOptions {
    confirmButtonLabel?: string
    initialValue?: string
    onConfirm?: (text: string) => Promise<void> | void
    placeholder?: string
    title?: string
}

export const useInputModal = () => {
    const isOpen = useState<boolean>('input-modal-open', () => false)
    const loading = useState<boolean>('input-modal-loading', () => false)
    const options = useState<InputModalOptions | null>('input-modal-options', () => null)

    const open = (opts: InputModalOptions) => {
        options.value = opts
        isOpen.value = true
    }

    const close = () => {
        isOpen.value = false
        loading.value = false
        options.value = null
    }

    const confirm = async (text: string) => {
        if (options.value?.onConfirm) {
            loading.value = true
            try {
                await options.value.onConfirm(text)
                close()
            } catch (error) {
                loading.value = false
                throw error
            }
        } else {
            close()
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
