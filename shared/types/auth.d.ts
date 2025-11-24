declare module '#auth-utils' {
    interface SecureSessionData {
        // Add your own fields
    }

    interface User {
        email: string
        id: string
        name: string
        surname: string
    }

    interface UserSession {
        // Add your own fields
    }
}

export {}
