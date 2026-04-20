'use client'
import { YStack, H1, Button, SizableText } from 'tamagui'
import { useRouter } from 'solito/navigation'
import { useState, useEffect } from 'react'
import { Platform } from 'react-native'
import * as Haptics from 'expo-haptics'
export function SettingsScreen() {
  const { back, push } = useRouter()
  const [mounted, setMounted] = useState(false)
  const handlePress = async () => {
    if (Platform.OS !== 'web') {
      try {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft)
      } catch (e) {
        alert('Вибрация не поддерживается')
      }
    }
  }
  useEffect(() => {
    setMounted(true)
  }, [])
  if (!mounted) return null
  return (
    <YStack f={1} jc="center" ai="center" gap="$4" bg="$background">
      <H1>Настройки</H1>
      <SizableText>Здесь будет конфигурация профиля</SizableText>
      <Button onPress={() => {
        if (Platform.OS === 'web') push("/")
        else back(); handlePress();
      }
      }>Назад</Button>
    </YStack>
  )
}
