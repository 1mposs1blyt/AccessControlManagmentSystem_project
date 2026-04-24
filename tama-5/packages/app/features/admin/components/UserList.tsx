import type { User } from "app/stores/types";
import { MyDatePicker } from "app/components/DatePicker/component";
import { getBaseUrl } from "app/utils/util";
import { useState, useEffect } from "react";
import { Paragraph, YStack, Spinner, ScrollView } from "tamagui";
import { UserComp } from "app/features/admin/components/User"
import { Platform } from "react-native";

export const UserList = () => {
  const [date, setdate] = useState(new Date())
  const [users, setUsers] = useState<User[]>([])
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
  const RenderUsers = () => {
    if (!users || users.length === 0) {
      return <Paragraph>Пользователей нет</Paragraph>
    }
    return users.map((u) => {
      return (
        <UserComp
          key={u.id}
          u={u}
          onStatusUpdate={updateLocalUserStatus}
          selectedDate={date}
        />
      )
    })
  }
  return (
    <YStack f={1} width="100%" p={Platform.OS === "web" ? "$4" : "$0"} pb="$10" minHeight={Platform.OS === 'web' ? '100dvh' : '100%'}>
      <YStack p="$4" bg="$background" borderBottomWidth={1} bc="$borderColor">
        <MyDatePicker currentDate={date} onDateChange={handleDateChange} />
      </YStack>
      {Platform.OS === 'web' ? (
        <YStack 
          f={1} 
          width="100%" 
          style={{ overflowY: 'auto' }}
        >
           <YStack space="$3" pb="$10">
              {loading ? <Spinner size="large" color="$blue10" p="$4" /> : RenderUsers()}
           </YStack>
        </YStack>
      ) : (
        <ScrollView f={1} width="100%">
          <YStack p="$4" space="$3" pb="$10">
             {loading ? <Spinner size="large" color="$blue10" p="$4" /> : RenderUsers()}
          </YStack>
        </ScrollView>
      )}
      {error && (
        <Paragraph pos="absolute" bottom={20} alignSelf="center" color="$red10" bg="$background" p="$2" br="$2">
          {error}
        </Paragraph>
      )}
    </YStack>
  )
}