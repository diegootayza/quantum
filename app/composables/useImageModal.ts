export interface ImageModalOptions {
    alt?: string
    url: string
}

export function useImageModal() {
    const isOpen = useState('imageModal:isOpen', () => false)
    const options = useState<ImageModalOptions | null>('imageModal:options', () => null)

    const open = (modalOptions: ImageModalOptions) => {
        options.value = modalOptions
        isOpen.value = true
    }

    const close = () => {
        isOpen.value = false
        options.value = null
    }

    return {
        close,
        isOpen,
        open,
        options,
    }
}
