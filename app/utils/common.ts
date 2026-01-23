export const valueToPath = (obj: Record<string, any>, path: string): any => {
    return path.split('.').reduce((acc, key) => acc?.[isNaN(Number(key)) ? key : Number(key)], obj)
}
