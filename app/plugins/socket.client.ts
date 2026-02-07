import { io, type Socket } from 'socket.io-client'

let socket = null as null | Socket

export default defineNuxtPlugin(async () => {
    const config = useRuntimeConfig()
    const { loggedIn, user } = useUserSession()

    function connect() {
        if (socket?.connected) return socket

        socket?.disconnect()

        socket = io(config.public.connectUrl, {
            auth: {
                userId: user.value?.id,
                userRole: user.value?.role,
            },
            transports: ['websocket'],
            withCredentials: true,
        })

        return socket
    }

    function disconnect() {
        socket?.disconnect()
        socket = null
    }

    watch(
        loggedIn,
        (v) => {
            if (v) connect()
            else disconnect()
        },
        { immediate: true },
    )

    return {
        provide: {
            socket,
        },
    }
})
