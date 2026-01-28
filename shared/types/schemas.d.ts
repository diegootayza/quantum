declare global {
    interface IFileSchema {
        createdAt: string
        id: string
        key: string
        mimeType: string
        size: number
        url: string
        userId: string
    }
}

export {}
