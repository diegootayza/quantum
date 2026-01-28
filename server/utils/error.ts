import { Prisma } from '@prisma/client'

export async function processError<T>(fn: () => Promise<T> | T) {
    try {
        return await fn()
    } catch (error) {
        const input = { message: 'Error interno del servidor', statusCode: 500 }

        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            switch (error.code) {
                case 'P2000':
                    input.message = 'El valor proporcionado es demasiado largo para el campo'
                    input.statusCode = 400
                    break
                case 'P2001':
                    input.message = 'El registro buscado no existe'
                    input.statusCode = 404
                    break
                case 'P2002':
                    input.message = 'Violación de restricción única. Este valor ya existe'
                    input.statusCode = 409
                    break
                case 'P2003':
                    input.message = 'Violación de clave foránea. El registro relacionado no existe'
                    input.statusCode = 400
                    break
                case 'P2004':
                    input.message = 'Violación de restricción en la base de datos'
                    input.statusCode = 400
                    break
                case 'P2005':
                    input.message = 'El valor almacenado en la base de datos es inválido para el tipo de campo'
                    input.statusCode = 500
                    break
                case 'P2006':
                    input.message = 'El valor proporcionado no es válido para el campo'
                    input.statusCode = 400
                    break
                case 'P2007':
                    input.message = 'Error de validación de datos'
                    input.statusCode = 400
                    break
                case 'P2008':
                    input.message = 'Error al analizar la consulta'
                    input.statusCode = 500
                    break
                case 'P2009':
                    input.message = 'Error al validar la consulta'
                    input.statusCode = 500
                    break
                case 'P2010':
                    input.message = 'Error en la consulta SQL sin procesar'
                    input.statusCode = 500
                    break
                case 'P2011':
                    input.message = 'Violación de restricción de nulidad'
                    input.statusCode = 400
                    break
                case 'P2012':
                    input.message = 'Falta un valor requerido'
                    input.statusCode = 400
                    break
                case 'P2013':
                    input.message = 'Falta un argumento requerido'
                    input.statusCode = 400
                    break
                case 'P2014':
                    input.message = 'La relación viola una restricción requerida'
                    input.statusCode = 400
                    break
                case 'P2015':
                    input.message = 'No se pudo encontrar un registro relacionado'
                    input.statusCode = 404
                    break
                case 'P2016':
                    input.message = 'Error de interpretación de la consulta'
                    input.statusCode = 500
                    break
                case 'P2017':
                    input.message = 'Los registros de la relación no están conectados'
                    input.statusCode = 400
                    break
                case 'P2018':
                    input.message = 'No se encontraron los registros conectados requeridos'
                    input.statusCode = 404
                    break
                case 'P2019':
                    input.message = 'Error de entrada'
                    input.statusCode = 400
                    break
                case 'P2020':
                    input.message = 'El valor está fuera de rango para el tipo de campo'
                    input.statusCode = 400
                    break
                case 'P2021':
                    input.message = 'La tabla no existe en la base de datos'
                    input.statusCode = 500
                    break
                case 'P2022':
                    input.message = 'La columna no existe en la base de datos'
                    input.statusCode = 500
                    break
                case 'P2023':
                    input.message = 'Datos de columna inconsistentes'
                    input.statusCode = 500
                    break
                case 'P2024':
                    input.message = 'Tiempo de espera agotado al obtener una conexión del pool'
                    input.statusCode = 408
                    break
                case 'P2025':
                    input.message = 'El registro a actualizar o eliminar no fue encontrado'
                    input.statusCode = 404
                    break
                case 'P2026':
                    input.message = 'El motor de base de datos actual no soporta esta característica'
                    input.statusCode = 500
                    break
                case 'P2027':
                    input.message = 'Múltiples errores ocurrieron durante la ejecución de la consulta'
                    input.statusCode = 500
                    break
                case 'P2028':
                    input.message = 'Error de API de transacción'
                    input.statusCode = 500
                    break
                case 'P2029':
                    input.message = 'Error de parámetro de consulta'
                    input.statusCode = 400
                    break
                case 'P2030':
                    input.message = 'No se pudo encontrar el índice de texto completo'
                    input.statusCode = 500
                    break
                case 'P2031':
                    input.message = 'MongoDB requiere que se cree una transacción en un conjunto de réplicas'
                    input.statusCode = 500
                    break
                case 'P2033':
                    input.message = 'Un número usado en la consulta no encaja en un entero de 64 bits'
                    input.statusCode = 400
                    break
                case 'P2034':
                    input.message = 'La transacción falló debido a un conflicto de escritura'
                    input.statusCode = 409
                    break
                default:
                    input.message = `Error de base de datos: ${error.code}`
                    input.statusCode = 500
                    break
            }
        } else if (error instanceof Prisma.PrismaClientUnknownRequestError) {
            input.message = 'Error desconocido en la base de datos'
            input.statusCode = 500
        } else if (error instanceof Prisma.PrismaClientRustPanicError) {
            input.message = 'Error crítico del motor de base de datos'
            input.statusCode = 500
        } else if (error instanceof Prisma.PrismaClientInitializationError) {
            input.message = 'Error al inicializar la conexión con la base de datos'
            input.statusCode = 503
        } else if (error instanceof Prisma.PrismaClientValidationError) {
            input.message = 'Error de validación en la consulta a la base de datos'
            input.statusCode = 400
        }

        throw createError(input)
    }
}
