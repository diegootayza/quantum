export function getCSSVariable(name: string) {
    if (import.meta.client && 'getComputedStyle' in window) {
        return getComputedStyle(document.documentElement).getPropertyValue(name).trim()
    }

    return ''
}
