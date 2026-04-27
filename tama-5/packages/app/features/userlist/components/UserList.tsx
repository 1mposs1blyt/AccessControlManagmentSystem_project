import type { User } from "app/stores/types";
import { MyDatePicker } from "app/features/userlist/components/DatePicker";
import { getBaseUrl } from "app/utils/util";
import { useState, useEffect, useCallback } from "react";
import { Paragraph, YStack, Spinner, ScrollView } from "tamagui";
import { UserComp } from "app/features/userlist/components/User"
import { Platform } from "react-native";
import { SizableText } from "tamagui";
import { Button } from "tamagui";
import { useRouter } from "solito/navigation";
import { useUserStore } from "app/stores/store";
export const UserList = () => {
  const { push } = useRouter()
  const [date, setdate] = useState(new Date())
  const refreshSignal = useUserStore((s) => s.refreshSignal)
  const [users, setUsers] = useState<User[]>([])
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState<boolean>(true);
  
  const handleDateChange = (newDate: Date) => {
    setdate(newDate)
  }
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
  const fetchUsers = useCallback(async () => {
    setLoading(true)
    try {
      const dateStr = date.toISOString().split('T')[0]
      const url = `${getBaseUrl()}/api/users?date=${dateStr}`
      const res = await fetch(url, { cache: 'no-store' })
      const data = await res.json()

      if (data && Array.isArray(data.users)) {
        const sorted = data.users.sort((a: User, b: User) => {
          if (a.role === 'ADMIN' && b.role !== 'ADMIN') return -1
          if (a.role !== 'ADMIN' && b.role === 'ADMIN') return 1
          return 0
        })
        setUsers(sorted)
      }
    } catch (err) {
      console.error(err)
      setError('Ошибка загрузки')
    } finally {
      setLoading(false)
    }
  }, [date])
  useEffect(() => {
    fetchUsers()
  }, [fetchUsers, refreshSignal])
  const RenderUsers = () => {
    if (!users || users.length === 0) {
      return <Paragraph>Пользователей нет</Paragraph>
    }
    return (
      Array.isArray(users) ? (
        users.map((u) => (
          <UserComp
            key={u.id}
            u={u}
            refreshList={fetchUsers}
            onStatusUpdate={updateLocalUserStatus}
            selectedDate={date}
          />
        ))
      ) : (
        <SizableText>Загрузка...</SizableText>
      )
    )
  }
  return (
    <YStack f={1} width="100%" p={Platform.OS === "web" ? "$4" : "$0"} minHeight={Platform.OS === 'web' ? '88dvh' : '100%'}>
      <YStack p="$4" bg="$background" borderBottomWidth={1} bc="$borderColor">
        <Button mb="$3" onPress={() => { push("/createuser") }}>Создание пользователя</Button>
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