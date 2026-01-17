export function useSocket() {
    const socket = useNuxtApp().$socket
    return { socket }
}
