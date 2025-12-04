import { Prisma } from '@prisma/client'

export async function processError<T>(fn: () => Promise<T> | T) {
    try {
        return await fn()
    } catch (error) {
        const input = { message: 'Error interno del servidor', statusCode: 500 }

        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            console.log('PrismaClientKnownRequestError')

            if (error.code === 'P2002') {
                input.message = 'Violación de restricción única'
                input.statusCode = 400
            }
        } else if (error instanceof Prisma.PrismaClientUnknownRequestError) {
            console.log('PrismaClientUnknownRequestError')
        } else if (error instanceof Prisma.PrismaClientRustPanicError) {
            console.log('PrismaClientRustPanicError')
        } else if (error instanceof Prisma.PrismaClientInitializationError) {
            console.log('PrismaClientInitializationError')
        } else if (error instanceof Prisma.PrismaClientValidationError) {
            console.log('PrismaClientValidationError')
        }

        throw createError(input)
    }
}
