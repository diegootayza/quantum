import type { UIMessageStreamWriter } from 'ai'

export function createHeartbeat(writer: UIMessageStreamWriter, intervalMs = 5000) {
    const interval = setInterval(() => {
        writer.write({
            data: { timestamp: Date.now() },
            type: 'data-heartbeat',
        })
    }, intervalMs)

    return () => clearInterval(interval)
}

export async function withHeartbeat<T>(writer: UIMessageStreamWriter, fn: () => Promise<T>): Promise<T> {
    const stopHeartbeat = createHeartbeat(writer)
    try {
        return await fn()
    } finally {
        stopHeartbeat()
    }
}
