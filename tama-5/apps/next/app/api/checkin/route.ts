export const dynamic = 'force-dynamic'
export const revalidate = 0
import { NextResponse } from 'next/server'
import { prisma } from '@app/db'

export async function POST(request: Request) {
  try {
    const { userId, type, method, location } = await request.json()
    const newCheckin = await prisma.checkin.create({
      data: {
        userId: userId,
        type: type, // "IN" || "OUT" || "NONE" 
        method: method || 'MANUAL',
        location: location || 'Main Office',
      },
    })
    return NextResponse.json({ success: true, checkin: newCheckin }, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      }
    })
  } catch (error) {
    console.error("ОШИБКА ЧЕКИНА:", error)
    return NextResponse.json({ error: 'Не удалось создать отметку' }, { status: 500 })
  }
}
