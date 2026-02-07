export const valueToPath = (obj: Record<string, any>, path: string): any => {
    return path.split('.').reduce((acc, key) => acc?.[isNaN(Number(key)) ? key : Number(key)], obj)
}

export async function axiosData<T>(promise: Promise<{ data: T }>): Promise<T> {
    const { data } = await promise
    return data
}

export async function axiosSafeData<T, D = undefined>(promise: Promise<{ data: T }>, defaultValue: D | undefined = undefined): Promise<D | T> {
    try {
        const { data } = await promise
        return data
    } catch {
        return defaultValue as D
    }
}

export function delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

export function delayReturn<T>(ms: number, value: T): Promise<T> {
    return new Promise((resolve) => setTimeout(() => resolve(value), ms))
}

export function generateKey(...args: string[]): string {
    return args.filter(Boolean).join('-')
}

export async function safeExecute<T, D = undefined>(fn: () => Promise<T>, defaultValue: D | undefined = undefined): Promise<D | T> {
    try {
        return await fn()
    } catch {
        return defaultValue as D
    }
}
