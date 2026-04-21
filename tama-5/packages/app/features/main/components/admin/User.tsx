import { getBaseUrl } from "app/utils/util"
import { YStack, XStack,Button, SizableText } from "tamagui"
import type { User } from "../../types"
export const UserComp = ({ u, onStatusUpdate, selectedDate }: { u: User, onStatusUpdate: any, selectedDate: Date }) => {
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