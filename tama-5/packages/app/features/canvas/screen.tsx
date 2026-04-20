'use client'
import { InfiniteCanvas } from 'app/components/Canvas/components'
import { useRouter } from 'solito/navigation'
import { useState, useEffect } from 'react'
import { useRoute } from '@react-navigation/native'
import { Platform } from 'react-native'
import * as Haptics from 'expo-haptics'
import { SizableText } from 'tamagui'

export function CanvasScreen() {
  const route = useRoute();
  const handlePress = async () => {
    if (Platform.OS !== 'web') {
      try {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft)
      } catch (e) {
        alert('Вибрация не поддерживается')
      }
    }
  }
  const { back } = useRouter()
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])
  if (!mounted) return null

  if (Platform.OS === "web") return <SizableText>Canvas doesn't supported ob web!</SizableText> 
  return (
    <InfiniteCanvas />
  )
}
