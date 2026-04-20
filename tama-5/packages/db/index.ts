// packages/db/index.ts
import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

// Добавим проверку process.env.DATABASE_URL ||
const connectionString = "postgresql://postgres:123456@localhost:5432/mynewdb"
console.log(connectionString)
if (!connectionString) {
  throw new Error("DATABASE_URL is not defined in environment variables")
}
const pool = new Pool({connectionString:connectionString})

const adapter = new PrismaPg(pool)
const globalForPrisma = global as unknown as { prisma: PrismaClient }
export const prisma = globalForPrisma.prisma || new PrismaClient({ adapter })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
