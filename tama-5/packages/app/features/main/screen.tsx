'use client'
import { YStack, Button } from "tamagui"
import { useAuthStore } from "app/features/auth/store"
import { H2, Paragraph, SizableText, Spinner } from "tamagui"
import { ScrollView } from "react-native"
import { XStack, H4 } from "tamagui"
import { Platform } from "react-native"
import { getBaseUrl } from "app/utils/util"
import { useEffect, useState } from "react"
import { MyDatePicker } from "app/components/DatePicker/component"


interface Checkin {
  id: number
  type: string
  userId: number
  user: User
  location: string
  method: string
  createdAt: string
}
interface User {
  id: number
  email: string
  password: string
  name: string
  role: string
  cardId: string
  checkins: Checkin[]
}
export function MainScreen() {
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  return (
    <YStack f={1} bg="$background">
      {
        Platform.OS === "web" ? (
          <XStack p="$4" jc="space-between" ai="center" bbw={1} bc="$borderColor">
            <H4>Панель доступа</H4>
            {
              user?.role === "ADMIN" ? (<SizableText size="$2">Вы вошли как {user?.role == "ADMIN" ? "администратор" : ""}</SizableText>) : null
            }
          </XStack>
        ) : null
      }
      <ScrollView>
        <Button m="$4"
          color="$red10" bg="$red5"
          animation="bouncy"
          pressStyle={{
            bg: "$red8",
            scale: 0.99,
            color: "white"
          }}
          hoverStyle={{
            bg: "$red6",
            scale: 0.99,
            color: "white"
          }}
          onPress={logout}>
          Logout
        </Button>
        {user?.role === 'ADMIN' ? (
          <>
            <AdminDashboard />
            <UserList />
          </>
        ) : (
          <UserHome />
        )}
      </ScrollView>
    </YStack>
  )
}
const AdminDashboard = () => {
  const createUser = async () => {
    try {
      const response = await fetch(`${getBaseUrl()}/api/auth/signup`, {
        method: 'POST',
        cache: 'no-store',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'mark@mail.com',
          password: '1234',
          name: 'mark',
          role: 'USER'
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('✅ Пользователь успешно создан:', data.user);
      } else {
        console.error('❌ Ошибка регистрации:', data.error);
      }
    } catch (err) {
      console.error('🔥 Сетевая ошибка:', err);
    }
  };

  return (
    <YStack space="$4" p="$4">
      { /*<Button mb="$4" onPress={() => alert("Заглушка.Запрос в коде!")}>Добавить пользователя</Button>*/}
      {/*<Button mb="$4" onPress={() => createUser()}>Добавить пользователя</Button>*/}
      <H2>Панель администратора</H2>
      <Paragraph>Список всех пользователей системы:</Paragraph>

    </YStack>
  )
}
const UserHome = () => (
  <YStack space="$4" p="$4" ai="center">
    <H2>Мой пропуск</H2>
    <Paragraph>Ваш QR-код для прохода:</Paragraph>
    <YStack bw={2} p="$4" br="$4">
      {/* Здесь будет QR */}
      <SizableText>QR CODE PLACEHOLDER</SizableText>
    </YStack>
  </YStack>
)
const UserList = () => {
  const [date, setdate] = useState(new Date())
  const [users, setUsers] = useState<User[]>()
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState<boolean>(true);
  const handleDateChange = (newDate: Date) => {
    setdate(newDate)
  }
  useEffect(() => {
    const GetUsers = async () => {
      setLoading(true)
      const dateStr = date.toISOString().split('T')[0]
      const url = `${getBaseUrl()}/api/users?date=${dateStr}`
      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          cache: 'no-store'
        })
        const data = await response.json()
        if (!response.ok) {
          setError(data.error)
          setTimeout(() => { setError('') }, 1800)
          throw new Error(data.error || 'Ошибка входа')
        }
        if (response.ok) {
          const allUsers = data.users || []
          const sortedUsers = allUsers.sort((a: User, b: User) => {
            if (a.role === 'ADMIN' && b.role !== 'ADMIN') return -1 // a выше b
            if (a.role !== 'ADMIN' && b.role === 'ADMIN') return 1  // b выше a
            return 0
          })
          setUsers(sortedUsers)
        }
      } catch (err) {
        console.log(err)
        setError('error')
      } finally {
        setLoading(false)
      }
    }
    GetUsers()
  }, [date])
  const updateLocalUserStatus = (userId: number, newCheckin: any) => {
    setUsers((prev: any) => {
      return prev.map((u: User) => {
        if (u.id === userId) {
          return { ...u, checkins: [newCheckin] }; // Создаем НОВЫЙ объект пользователя
        }
        return u;
      });
    });
  }
  const renderUsers = () => {
    if (!users || users.length === 0) {
      return <Paragraph>Пользователей нет</Paragraph>
    }
    return users.map((u) => {
      if (u.role === 'ADMIN') {
        return <User
          key={u.id}
          u={u}
          onStatusUpdate={updateLocalUserStatus}
          selectedDate={date} // <-- Передаем дату из стейта календаря
        />
      }
      return <User
        key={u.id}
        u={u}
        onStatusUpdate={updateLocalUserStatus}
        selectedDate={date} // <-- Передаем дату из стейта календаря
      />
    })
  }
  return (
    <YStack f={1} p="$4" space="$2">
      <MyDatePicker onDateChange={handleDateChange} />
      <Paragraph mb="$3" textAlign="start">Список пользователей:</Paragraph>
      {error && <Paragraph color="$red10">{error}</Paragraph>}
      {loading ?
        <Spinner size="large" color="$blue10" p="$4" /> :
        renderUsers()
      }
    </YStack>
  )
}
const User = ({ u, onStatusUpdate, selectedDate }: { u: User, onStatusUpdate: any, selectedDate: Date }) => {
  const lastCheckin = u.checkins && u.checkins.length > 0 ? u.checkins[0] : null
  const isPresent = lastCheckin?.type
  const Type = lastCheckin?.type
  const handleCheckin = async (userId: number, type: 'IN' | 'OUT' | 'NONE') => {
    try {
      const dateToSave = new Date(selectedDate)
      const now = new Date()

      if (dateToSave.toDateString() === now.toDateString()) {
        dateToSave.setHours(now.getHours(), now.getMinutes(), now.getSeconds())
      } else {
        dateToSave.setHours(12, 0, 0)
      }

      const response = await fetch(`${getBaseUrl()}/api/checkin`, {
        method: 'POST',
        cache: 'no-store',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          type,
          method: 'MANUAL',
          createdAt: selectedDate.toISOString(),
        }),
      })
      const data = await response.json()

      if (!response.ok) throw new Error('Ошибка сети')
      if (response.ok) onStatusUpdate(userId, data.checkin)
    } catch (err) {
      console.error(err)
    }
  }
  const isAdmin = u.role === 'ADMIN'
  return (
    <YStack
      bw={isPresent ? 2 : 0}
      key={u.id}
      p="$3"
      br="$4"
      bg={Type === "IN" ? "$green3" : Type === "OUT" ? "$red3" : isAdmin ? "$gray3" : "$gray3"}
      borderLeftWidth={5}
      bc={Type === "IN" ? "$green8" : Type === "OUT" ? "$red8" : "$gray3"}
      animation="lazy"
      mb="$3"
      borderLeftColor={isAdmin ? "$purple10" : "$green10"}

    >
      <XStack pt="$2" pl="$2" jc="space-between" ai="flex-start" mb="$2">
        <YStack>
          <SizableText fow="700" size="$4" color={isAdmin ? "$purple10" : "$color"}>
            {u.name.charAt(0).toUpperCase() + u.name.slice(1) || 'Без имени'}
          </SizableText>
          <SizableText size="$2" color="$colorSubtitle">{u.email}</SizableText>
          <SizableText size="$2" color="$colorSubtitle">
            {
              Type === "IN" ?
                `Зашел в ${new Date(lastCheckin!.createdAt).toLocaleTimeString()}`
                :
                Type === "OUT" ?
                  `Отмечечен в ${new Date(lastCheckin!.createdAt).toLocaleTimeString()}`
                  : !isAdmin ?
                    'Нет на месте'
                    : "Администратор"
            }
          </SizableText>
        </YStack>
        <SizableText
          theme={isAdmin ? "purple" : "alt2"}
          size="$2"
          px="$2"
          py="$1"
          br="$2"
          bg="$background"
        >
          {u.role}
        </SizableText>
      </XStack>

      <XStack
        mt="$2"
        pt="$2"
        btw={1}
        bc="$borderColor"
        jc="space-between"
        ai="center"
      >
        <XStack space="$2">
          {
            isAdmin ? null :
              <>
                <Button
                  onPress={() => handleCheckin(u.id, 'IN')}
                  size="$3"
                  circular
                  theme="green"
                  icon={<SizableText>+</SizableText>} />
                <Button
                  onPress={() => handleCheckin(u.id, 'OUT')}
                  size="$3"
                  circular
                  theme="red"
                  icon={<SizableText>-</SizableText>} />
                <Button
                  onPress={() => handleCheckin(u.id, 'NONE')}
                  size="$3"
                  circular
                  theme="yellow"
                  icon={<SizableText>%</SizableText>} />
              </>
          }

        </XStack>

        <XStack space="$2">
          <Button size="$3" circular icon={<SizableText>✎</SizableText>} />
          <Button size="$3" circular theme="red" icon={<SizableText>🗑</SizableText>} />
        </XStack>

      </XStack>
    </YStack>
  )
}