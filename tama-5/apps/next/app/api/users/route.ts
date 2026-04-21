import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@app/db'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const dateParam = searchParams.get('date') // Получим "2023-10-25"

  // Создаем объект даты из параметра или берем текущий момент
  const targetDate = dateParam ? new Date(dateParam) : new Date()

  // Устанавливаем границы дня строго по местному времени
  const startOfDay = new Date(targetDate)
  startOfDay.setHours(0, 0, 0, 0)

  const endOfDay = new Date(targetDate)
  endOfDay.setHours(23, 59, 59, 999)
  try {
    console.log("!!! ВЫЗОВ БЕЗ ДАТЫ !!! " + Math.random());
    const users = await prisma.user.findMany({
      include: {
        checkins: {
          where: {
            createdAt: {
              gte: startOfDay,
              lte: endOfDay,
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    })
    return NextResponse.json({ users }, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      }
    })
  } catch (error: any) {
    console.error("FULL ERROR:", error.meta?.driverAdapterError || error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
