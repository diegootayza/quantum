declare global {
    namespace API {
        type AuthSigninData = {
            email: string
            password: string
        }

        type AuthSignupData = {
            email: string
            name: string
            password: string
            surname: string
        }

        type AuthUserResponse = {
            active: boolean
            email: string
            id: string
            name: string
            role: 'ADMIN' | 'USER'
            surname: string
        }

        type Chat = {
            agentId: null | string
            createdAt: string
            id: string
            name: string
            updatedAt: string
            userId: string
        }

        type ChatAgent = {
            active: boolean
            createdAt: string
            description: string
            id: string
            instruction: string
            model: string
            name: string
            updatedAt: string
        }

        type ChatMessage = {
            createdAt: string
            id: string
            parts: any[]
            role: string
            updatedAt: string
        }

        type DashboardHomeResponse = {
            sizeFiles: number
            totalChats: number
            totalMessages: number
            totalUsers: number
            usageByModel: Array<{ day: string; model: string; tokens: number }>
        }

        type File = {
            createdAt: string
            id: string
            key: string
            mimeType: string
            size: number
            type: string
            userId?: string
        }

        type Model = {
            active: boolean
            createdAt: string
            id: string
            name: string
            roles: string[]
            updatedAt: string
            value: string
        }

        type OkResponse = {
            ok: boolean
        }

        type ProfileChatsResponse = {
            id: string
            name: string
        }

        type ProfileFilesResponse = {
            id: string
            key: string
            size: number
            type: string
            url: string
        }

        type ProfileHomeResponse = {
            accountAge: number
            chatsThisMonth: number
            storageUsed: number
            totalChats: number
            totalFiles: number
            totalMessages: number
        }

        type ProfileNavigation = {
            agents: { id: string; name: string }[]
            chats: { id: string; name: string }[]
        }

        type Prompt = {
            description: string
            id: string
            key: string
            value: string
        }

        type ResponseList<T> = {
            docs: T[]
            meta: {
                nextCursor: null | string
            }
        }

        type ResponseOk = {
            ok: boolean
        }

        type Setting = {
            id: string
            namespace: string
            value: RecordType
        }

        type User = {
            active: boolean
            createdAt: string
            email: string
            id: string
            name: string
            role: string
            surname: string
            updatedAt: string
        }
    }

    type ApiData = {
        chat: API.Chat
        'chat-agent': API.ChatAgent
        file: API.File
        model: API.Model
        prompt: API.Prompt
        setting: API.Setting
        user: API.User
    }

    type ApiDataType = keyof ApiData

    type ApiResponseList<T extends ApiDataType> = API.ResponseList<ApiData[T]>
}

export {}
