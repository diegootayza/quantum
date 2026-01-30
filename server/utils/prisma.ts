import { Prisma, PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma?: ReturnType<typeof makePrisma> }

function makePrisma() {
    const base = new PrismaClient({ log: ['error', 'warn'] })

    return base.$extends({
        model: {
            $allModels: {
                async paginate<TDelegate extends { count: (args: any) => any; findMany: (args: any) => any }, TArgs extends Prisma.Args<TDelegate, 'findMany'>>(
                    this: TDelegate,
                    args: { limit?: number; page?: number } & TArgs,
                ): Promise<{
                    docs: Prisma.Result<TDelegate, TArgs, 'findMany'>
                    meta: { limit: number; page: number; totalDocs: number; totalPages: number }
                }> {
                    const ctx = Prisma.getExtensionContext(this) as TDelegate

                    const { limit = 10, page = 1, ...rest } = args
                    const skip = (page - 1) * limit

                    const [docs, totalDocs] = await Promise.all([ctx.findMany({ ...rest, skip, take: limit }), ctx.count({ where: (rest as any).where })])

                    return {
                        docs,
                        meta: {
                            limit,
                            page,
                            totalDocs,
                            totalPages: Math.ceil(totalDocs / limit),
                        },
                    }
                },
            },
        },
        name: 'paginate',
    })
}

export const prisma = globalForPrisma.prisma ?? makePrisma()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma
