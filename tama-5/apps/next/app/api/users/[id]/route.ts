import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@app/db'
import bcrypt from 'bcrypt'


export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        // 1. Ждем разрешения Promise params
        const resolvedParams = await params
        const id = Number(resolvedParams.id)

        const user = await prisma.user.findUnique({
            where: { id },
        })

        if (!user) {
            return NextResponse.json({ error: 'User not found', status: 404 }, { status: 404 })
        }

        return NextResponse.json(user, { status: 200 })
    } catch (error) {
        console.error("API Error:", error)
        return NextResponse.json({ error: 'Internal Server Error', status: 500 }, { status: 500 })
    }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params
        const body = await request.json()
        if (body.password) {
            const salt = await bcrypt.genSalt(10)
            body.password = await bcrypt.hash(body.password, salt)
        }

        const updatedUser = await prisma.user.update({
            where: { id: Number(id) },
            data: body,
        })

        return NextResponse.json(updatedUser)
    } catch (error) {
        return NextResponse.json({ error: 'Update failed', status: 500 }, { status: 500 })
    }
}
