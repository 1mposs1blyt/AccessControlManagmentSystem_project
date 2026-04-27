import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { AuthScreen } from 'app/features/auth/screen'
import { CheckinScreen } from 'app/features/checkin/screen'
import { MainScreen } from 'app/features/main/screen'
import { useTheme } from 'tamagui'
import { useState, useEffect } from "react"
import { useAuthStore } from 'app/stores/store'
import { Button } from 'tamagui'
import { UserEditScreen } from 'app/features/useredit/screen'
import { UserCreationScreen } from 'app/features/usercreate/screen'
const Stack = createNativeStackNavigator<{
  main: undefined
  auth: undefined
  checkin: undefined
  settings: undefined
  useredit: { id: string }
  createuser: undefined
}>()

export function NativeNavigation() {
  const theme = useTheme()
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const [isReady, setIsReady] = useState(false)
  const logout = useAuthStore((state) => state.logout)
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
              options={{
                title: 'Home',
                headerRight: () => (
                  <Button m="$4"
                    color="$red10" bg="$red5"
                    animation="bouncy"
                    pressStyle={{
                      bg: "$red8",
                      scale: 0.99,
                      color: "white"
                    }}
                    hoverStyle={{
                      bg: "$red6",
                      scale: 0.99,
                      color: "white"
                    }}
                    onPress={logout}>
                    Выход
                  </Button>
                )
              }}
            />
            <Stack.Screen
              name="checkin"
              component={CheckinScreen}
              options={{ title: 'Auth' }}
            />
            <Stack.Screen
              name="useredit"
              component={UserEditScreen}
              options={{
                title: "User edit"
              }}
            />
            <Stack.Screen
              name="createuser"
              component={UserCreationScreen}
              options={{
                title: "Create user"
              }}
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
