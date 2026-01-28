import jwt from 'jsonwebtoken'

export default defineEventHandler(async (event) => {
    return processError(async () => {
        try {
            const { user } = await requireUserSession(event)

            const token = jwt.sign({ role: user?.role }, process.env.SOCKET_JWT_SECRET!, {
                expiresIn: '1h',
                subject: user?.id,
            })

            return { token }
        } catch {
            return { token: null }
        }
    })
})
