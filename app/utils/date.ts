export function getLastDays(n: number) {
    const days: string[] = []

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    for (let i = n - 1; i >= 0; i--) {
        const d = new Date(today)
        d.setDate(today.getDate() - i)

        days.push(d.toISOString().slice(0, 10))
    }

    return days
}
