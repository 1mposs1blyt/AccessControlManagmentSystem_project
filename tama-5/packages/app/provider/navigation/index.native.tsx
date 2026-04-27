import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native'
import * as Linking from 'expo-linking'
import { useMemo } from 'react'
import { useColorScheme } from 'react-native'

export function NavigationProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const scheme = useColorScheme()
  return (
    <NavigationContainer
      theme={scheme === 'dark' ? DarkTheme : DefaultTheme}
      linking={useMemo(
        () => ({
          prefixes: [Linking.createURL('/')],
          config: {
            screens: {
              main: "/",
              auth: "/auth",
              checkin: "/checkin",
              settings: "/settings",
              useredit: {
                path: 'useredit/:id',
                parse: {
                  id: (id: number) => `${id}`,
                },
              },
              createuser:"/createuser"
            },
          },
        }) as any,
        []
      )}
    >
      <>{children}</>
    </NavigationContainer>
  )
}
