import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

const getDatabaseUrl = () => {
  const url = process.env.DATABASE_URL
  if (url && !url.includes('${')) {
    return url
  }
  const user = process.env.DATABASE_USER || 'postgres'
  const pass = process.env.DATABASE_PASSWORD ? `:${process.env.DATABASE_PASSWORD}` : ''
  const host = process.env.DATABASE_HOST || 'localhost'
  const port = process.env.DATABASE_PORT || '5432'
  const db = process.env.DATABASE_NAME || 'portfolio'
  return `postgresql://${user}${pass}@${host}:${port}/${db}?schema=public`
}

const connectionString = getDatabaseUrl()
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)

// Prevent multiple instances of Prisma Client in development (HMR)
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
