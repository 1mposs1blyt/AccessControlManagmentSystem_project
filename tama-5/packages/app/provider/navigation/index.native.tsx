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
              home: '',
              settings: 'settings',
              profile: {
                path: 'profile/:id',
                initialRouteName: undefined,
                exact: true,
              },
              about: 'about',
              usersList: "usersList",
              canvas: "canvas"
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
