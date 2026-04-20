'use client'
import { Text, View } from 'tamagui'
import { useParams, useRouter } from 'solito/navigation'
import { useState, useEffect } from 'react'

const useUserParams = useParams<{ id: string }>

export default function Home() {
  const { id } = useUserParams()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])
  if (!mounted) return null
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text onPress={() => router.push('/')}>
        Hi {id}, click me to go back
      </Text>
    </View>
  )
}
