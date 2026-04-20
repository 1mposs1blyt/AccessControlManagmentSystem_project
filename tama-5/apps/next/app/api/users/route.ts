import { NextResponse } from 'next/server'
import { prisma } from '@app/db'

export async function GET() {
  try {
    console.log("Checking DB URL:", process.env.DATABASE_URL?.split('@')[1]) // выведет хост для проверки
    const users = await prisma.user.findMany()
    return NextResponse.json({ users })
  } catch (error: any) {
    console.error("FULL ERROR:", error.meta?.driverAdapterError || error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
