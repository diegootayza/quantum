declare global {
    interface CommonTableColumn<T = any> {
        class?: string
        classCell?: string
        classHeader?: string
        key: string
        label?: string
    }
}

export {}
