export function formatFileSize(size: number) {
    if (!size) return '0 B'

    const units = ['byte', 'kilobyte', 'megabyte', 'gigabyte', 'terabyte', 'petabyte']
    const step = 1024

    const index = Math.floor(Math.log(size) / Math.log(step))
    const value = size / Math.pow(step, index)

    return new Intl.NumberFormat('es', {
        maximumFractionDigits: value >= 10 ? 0 : 1,
        style: 'unit',
        unit: units[index],
        unitDisplay: 'short',
    }).format(value)
}

export function formatSearchText(text: string) {
    return text.trim().replace(/\s+/g, ' ').toLowerCase()
}
