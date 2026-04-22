import { NextResponse } from 'next/server'
import { prisma } from '@app/db'

export async function POST(request: Request) {
  try {
    const { qrData, userId, type } = await request.json()

    // Можно расшифровать qrData, чтобы убедиться, что это наш QR
    const decodedQr = Buffer.from(qrData, 'base64').toString('utf-8')
    const qrInfo = JSON.parse(decodedQr)

    if (qrInfo.secret !== 'door_777') {
      return NextResponse.json({ error: 'Чужой QR' }, { status: 400 })
    }

    const newCheckin = await prisma.checkin.create({
      data: {
        userId: userId, // Используем ID, который прислал Zustand
        type: type || 'IN',
        method: 'QR_CODE',
        location: qrInfo.locationId || 'Main Office',
      },
    })

    return NextResponse.json({ success: true, checkin: newCheckin })
  } catch (error) {
    return NextResponse.json({ error: 'Ошибка' }, { status: 500 })
  }
}
