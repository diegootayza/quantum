import { io, type Socket } from 'socket.io-client'

let socket: null | Socket = null

export default defineNuxtPlugin(() => {
    const config = useRuntimeConfig()
    const { user } = useUserSession()
    const { setUsers } = useUsersStore()

    if (!socket) {
        socket = io(config.public.connectUrl, {
            autoConnect: true,
            path: '/socket.io',
            transports: ['websocket'],
            withCredentials: true,
        })
    }

    socket.on('connect', () => {
        if (user.value) {
            socket?.emit('user:online', { id: user.value.id })
        }
    })

    socket.on('users', (data: Record<string, string[]>) => {
        setUsers(data)
    })

    watch(user, (v) => {
        if (socket?.connected && v === null) {
            socket?.emit('user:offline')
        }
    })

    return {
        provide: { socket },
    }
})
