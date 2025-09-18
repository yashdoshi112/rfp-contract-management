// backend/src/prisma.ts
import { PrismaClient } from '@prisma/client'

// Avoid creating multiple clients during dev hot-reload
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    // log: ['query','error','warn'], // uncomment for debugging
  })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

export default prisma
