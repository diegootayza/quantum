declare global {
    type ErrorData = {
        error: string
        message: string
        statusCode: number
    }

    type RecordType<T = any> = Record<string, T>

    type UserData = {
        active: boolean
        email: string
        id: string
        name: string
        role: 'ADMIN' | 'USER'
        surname: string
    }
}

export {}
