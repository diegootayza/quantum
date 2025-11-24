declare global {
    interface Instruction {
        active: boolean
        content: string
        createdAt: string
        description: string
        id: string
        name: string
        updatedAt: string
    }
}

export {}
