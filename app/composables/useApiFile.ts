export function useApiFile() {
    const axios = useAxios()

    function updateOne(id: string, data: UpdateChatSchema) {
        return axiosSafeData(axios.patch<API.Chat>(`${API_ENDPOINT.CHAT_UPDATE}/${id}`, data))
    }

    function createOne(data: CreateChatSchema) {
        return axiosSafeData(axios.post<API.Chat>(API_ENDPOINT.CHAT_CREATE, data))
    }

    function createMany(data: CreateFileSchema) {
        const formData = new FormData()

        formData.append('path', data.path)
        formData.append('type', data.type)
        if (data.userId) formData.append('userId', data.userId)
        data.files.forEach((file) => formData.append('files', file))

        return axiosSafeData(axios.post<({ url: string } & API.File)[]>(API_ENDPOINT.FILE_CREATE_MANY, formData))
    }

    function deleteMany(ids: string[]) {
        return axiosSafeData(axios.post<API.ResponseOk>(`${API_ENDPOINT.FILE_DELETE_MANY}`, { ids }))
    }

    function deleteOne(id: string) {
        return axiosSafeData(axios.delete<API.Chat>(`${API_ENDPOINT.CHAT_DELETE}/${id}`))
    }

    return {
        createMany,
        createOne,
        deleteMany,
        deleteOne,
        updateOne,
    }
}
