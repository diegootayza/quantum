import type { AxiosRequestConfig } from 'axios'

import axios from 'axios'
import { extension } from 'mime-types'

export const connectGet = async <T = unknown>(path: string, config?: AxiosRequestConfig<any>) => {
    try {
        const { data } = await axios.get<T>(`${process.env.CONNECT_URL!}/${path}`, config)

        return data
    } catch {
        return null
    }
}

export const connectUpload = async ({ base64, mediaType, path, type, userId }: { base64: string; mediaType: string; path: string; type: string; userId?: string }) => {
    try {
        const formData = new FormData()

        formData.append('path', path)
        formData.append('type', type)
        if (userId) formData.append('userId', userId)

        const file = new File([Buffer.from(base64, 'base64')], `file.${extension(mediaType) || 'bin'}`, { type: mediaType })

        formData.append('files', file)

        const response = await fetch(`${process.env.CONNECT_URL!}/api/file`, {
            body: formData,
            method: 'POST',
        })

        return (await response.json()) as IFileSchema[]
    } catch {
        return null
    }
}
