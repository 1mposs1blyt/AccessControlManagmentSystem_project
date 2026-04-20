import { NextResponse } from 'next/server'
import { prisma } from '@app/db'
import bcrypt from 'bcrypt' // для проверки пароля
import jwt from 'jsonwebtoken'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()
    console.log(email, password)
    // 1. Поиск пользователя
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return NextResponse.json({ error: 'Пользователь не найден' }, { status: 401 })
    }

    // 2. Проверка пароля (если используете хеширование)
    const isPasswordValid = await bcrypt.compare(password, user.password)
    //const isPasswordValid = password === user.password // Упрощенно для примера

    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Неверный пароль' }, { status: 401 })
    }

    // 3. Генерация токена
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    )
    const { password: _, ...userWithoutPassword } = user
    // 4. Отправка ответа с токеном
    const response = NextResponse.json({
      success: true,
      user: userWithoutPassword
    })

    // Установка куки (HttpOnly для безопасности)
    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 1 неделя
      path: '/',
    })

    return response
  } catch (error) {
    console.error("ОШИБКА ПРИ ВХОДЕ:", error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}
