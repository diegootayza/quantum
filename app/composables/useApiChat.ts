export function useApiChat() {
    const axios = useAxios()

    function updateChat(id: string, data: UpdateChatSchema) {
        return axiosSafeData(axios.patch<API.Chat>(`${API_ENDPOINT.CHAT_UPDATE}/${id}`, data))
    }

    function createChat(data: CreateChatSchema) {
        return axiosSafeData(axios.post<API.Chat>(API_ENDPOINT.CHAT_CREATE, data))
    }

    function deleteChat(id: string) {
        return axiosSafeData(axios.delete<API.Chat>(`${API_ENDPOINT.CHAT_DELETE}/${id}`))
    }

    return {
        createChat,
        deleteChat,
        updateChat,
    }
}
