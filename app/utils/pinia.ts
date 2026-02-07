type StoreActions<T> = {
    [K in keyof T as K extends `$${string}` ? never : T[K] extends (...args: any) => any ? K : never]: T[K]
}

export function storeToActions<T extends object>(store: T): StoreActions<T> {
    const entries = Object.entries(store).filter(([key, value]) => typeof value === 'function' && !key.startsWith('$'))
    return Object.fromEntries(entries) as unknown as StoreActions<T>
}
