import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@app/db'

export async function DELETE(request: NextRequest) {
	try {
		const { userId } = await request.json()
		console.log(typeof userId, userId)
		if (!userId) return NextResponse.json({ error: "Пользователь не найден", status: 404 })

		await prisma.user.delete({
			where: {
				id: Number(userId)
			}
		})
		return NextResponse.json({ success: true }, { status: 200 })
	} catch (error) {
		return NextResponse.json({ error: error }, { status: 500 })
	}
}