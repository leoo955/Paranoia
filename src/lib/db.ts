import { PrismaClient } from '@prisma/client'
import { Pool, types } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

// Fix for BigInt serialization
types.setTypeParser(20, val => parseInt(val, 10))

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
  pool: Pool | undefined
}

const connectionString = process.env.DATABASE_URL

if (!globalForPrisma.pool) {
  const isRender = connectionString?.includes('render.com')
  globalForPrisma.pool = new Pool({ 
    connectionString,
    ssl: isRender ? { rejectUnauthorized: false } : false,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  })

  globalForPrisma.pool.on('error', (err) => {
    console.error('Unexpected error on idle database client', err)
  })
}

const adapter = new PrismaPg(globalForPrisma.pool)

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ 
  adapter,
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
})

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}