'use client'
import { createParam } from 'solito'
import { YStack, SizableText, Button } from 'tamagui'
import { useRouter } from 'solito/navigation'
import { useState, useEffect } from 'react'
import { useRoute } from '@react-navigation/native'
import { Platform } from 'react-native'
import * as Haptics from 'expo-haptics'

export function UserDetailScreen() {
  const route = useRoute();
  const { useParam } = createParam<{ id: string }>()
  const [idParam] = useParam('id')
  const handlePress = async () => {
    if (Platform.OS !== 'web') {
      try {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft)
      } catch (e) {
        alert('Вибрация не поддерживается')
      }
    }
  }
  // ХАК: Если Solito/React Navigation положили id в 'screen', забираем его оттуда
  // @ts-ignore
  const id = idParam || route.params?.id || route.params?.screen
  const { back } = useRouter()
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])
  if (!mounted) return null
  return (
    <YStack f={1} jc="center" ai="center" bg="$background" gap="$4">
      <SizableText fz="$8">Пользователь: {id}</SizableText>
      <Button onPress={() => { handlePress(); back() }}>Назад</Button>
    </YStack>
  )
}
