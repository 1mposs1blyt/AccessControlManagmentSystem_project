import { NextResponse } from 'next/server'
import { prisma } from '@app/db'

export async function POST(request: Request) {
  try {
    const { userId, type, method, location, createdAt } = await request.json()
    const newCheckin = await prisma.checkin.create({
      data: {
        userId: userId,
        type: type, // "IN" || "OUT" || "NONE" 
        method: method || 'MANUAL',
        location: location || 'Main Office',
        createdAt: createdAt ? new Date(createdAt) : new Date()
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
export const dynamic = 'force-dynamic' // Отключает кэширование на уровне сборки

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ success: false, error: 'userId is required' }, { status: 400 })
    }

    const checkins = await prisma.checkin.findMany({
      where: { userId: Number(userId) },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ success: true, data: checkins })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 })
  }
}