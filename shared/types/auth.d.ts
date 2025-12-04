declare module '#auth-utils' {
    interface SecureSessionData {
        id: string
        role: 'ADMIN' | 'USER'
    }

    interface User {
        active: boolean
        email: string
        id: string
        name: string
        role: 'ADMIN' | 'USER'
        subscriptionId?: string | null
        surname: string
    }

    interface UserSession {
        // Add your own fields
    }
}

export { }
