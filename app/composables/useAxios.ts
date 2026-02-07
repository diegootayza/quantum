export function useAxios() {
    const { $axios } = useNuxtApp()
    return $axios
}
