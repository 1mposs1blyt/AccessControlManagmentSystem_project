import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { AuthScreen } from 'app/features/auth/screen'
import { CheckinScreen } from 'app/features/checkin/screen'
import { MainScreen } from 'app/features/main/screen'
import { useTheme } from 'tamagui'
import { useState, useEffect } from "react"
import { useAuthStore } from 'app/stores/store'
const Stack = createNativeStackNavigator<{
  main: undefined
  auth: undefined
  checkin: undefined
}>()

export function NativeNavigation() {
  const theme = useTheme()
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    setIsReady(true)
  }, [])
  if (!isReady) return null
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.background.get(),
        },
        headerTintColor: theme.color.get(),
      }}>
      {
        isAuthenticated ? (
          <>
            <Stack.Screen
              name="main"
              component={MainScreen}
              options={{ title: 'Home' }}
            />
            <Stack.Screen
              name="checkin"
              component={CheckinScreen}
              options={{ title: 'Auth' }}
            />
          </>
        ) : (
          <Stack.Screen
            name="auth"
            component={AuthScreen}
            options={{ title: 'Auth' }}
          />
        )
      }
    </Stack.Navigator>
  )
}
