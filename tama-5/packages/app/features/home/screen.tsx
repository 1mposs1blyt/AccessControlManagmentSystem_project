'use client'
import { useEffect, useState } from 'react'
import { YStack, H1 } from 'tamagui'
import { useRouter } from 'solito/navigation'
import { Button } from 'tamagui'
import * as Haptics from 'expo-haptics'
import { Platform } from 'react-native'
import { SizableText } from 'tamagui'
export function HomeScreen() {
  const { push, replace } = useRouter();
  const [mounted, setMounted] = useState(false)
  const handlePress = async () => {
    if (Platform.OS !== 'web') {
      try {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
      } catch (e) {
        console.log('Device cant use vibration!')
      }
    }
  }
  useEffect(() => {
    setMounted(true)
  }, [])
  if (!mounted) return null
  return (
    <YStack justifyContent="center" backgroundColor="$background" p="$4" width="100%" height="100%" minHeight="100svh" minWidth="100svw">
      <H1 color="$color" pb="$4" textAlign="center">Solito app example</H1>
      <YStack bg="$background" p="$4">
      </YStack>
      <YStack gap="$4" >

        <Button onPress={() => { handlePress(); push('/about') }}>
          About
        </Button>

        <Button onPress={() => { handlePress(); replace('/settings') }}>
          Settings
        </Button>

        <Button onPress={() => { handlePress(); push('/profile/alex') }}>
          User
        </Button>

        <Button onPress={() => { handlePress(); push('/usersList') }}>
          Users
        </Button>

        <Button onPress={() => { handlePress(); alert("This is alert!") }}>
          Alert
        </Button>

        <Button onPress={()=>{ handlePress(); push("/canvas")}}>
          Canvas
        </Button>
      </YStack>
    </YStack>
  )
}
