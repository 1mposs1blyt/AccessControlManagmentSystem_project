import type { User } from "../../types";
import { MyDatePicker } from "app/components/DatePicker/component";
import { getBaseUrl } from "app/utils/util";
import { useState, useEffect } from "react";
import { ScrollView } from "react-native";
import { Paragraph, YStack, Spinner } from "tamagui";
import { UserComp } from "app/features/main/components/admin/User"

export const UserList = () => {
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
        return <UserComp
          key={u.id}
          u={u}
          onStatusUpdate={updateLocalUserStatus}
          selectedDate={date} // <-- Передаем дату из стейта календаря
        />
      }
      return <UserComp
        key={u.id}
        u={u}
        onStatusUpdate={updateLocalUserStatus}
        selectedDate={date} // <-- Передаем дату из стейта календаря
      />
    })
  }
  return (
    <YStack f={1}>
      <MyDatePicker currentDate={date} onDateChange={handleDateChange} />
      <ScrollView
        contentContainerStyle={{
          padding: 16,
          paddingBottom: 40
        }}
      >
        {error && <Paragraph color="$red10" mb="$3">{error}</Paragraph>}
        {loading ? (
          <Spinner size="large" color="$blue10" p="$4" />
        ) : (
          <YStack space="$3">
            {renderUsers()}
          </YStack>
        )}
      </ScrollView>
    </YStack>

  )
}