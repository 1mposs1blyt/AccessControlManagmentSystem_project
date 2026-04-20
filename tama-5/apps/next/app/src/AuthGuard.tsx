'use client'
import { useAuthStore } from 'app/features/auth/store'
import { AuthScreen } from 'app/features/auth/screen'
import { useEffect, useState } from 'react'

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    setIsReady(true)
  }, [])

  if (!isReady) return null

  return <>{isAuthenticated ? children : <AuthScreen />}</>
}
