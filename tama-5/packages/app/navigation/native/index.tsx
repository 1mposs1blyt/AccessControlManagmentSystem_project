import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { HomeScreen } from 'app/features/home/screen'
import { UserDetailScreen } from 'app/features/user/screen'
import { SettingsScreen } from 'app/features/settings/screen'
import { AboutScreen } from 'app/features/about/screen'
import { useTheme } from 'tamagui'
import { UsersListScreen } from 'app/features/userlist/screen'
import { CanvasScreen } from 'app/features/canvas/screen'
const Stack = createNativeStackNavigator<{
  home: undefined
  settings: undefined
  profile: { id: string }
  about: undefined
  canvas:undefined
  usersList:undefined
}>()

export function NativeNavigation() {

  // Внутри компонента навигатора:
  const theme = useTheme()
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.background.get(),
        },
        headerTintColor: theme.color.get(),
      }}>
      <Stack.Screen
        name="home"
        component={HomeScreen}
        options={{ title: 'Home' }}
      />
      <Stack.Screen
        name="settings"
        component={SettingsScreen}
        options={{ title: 'Настройки' }}
      />
      <Stack.Screen
        name="profile"
        component={UserDetailScreen}
        options={{ title: 'Пользователь' }}
      />
      <Stack.Screen
        name="about"
        component={AboutScreen}
        options={{ title: 'О приложении' }}
      />
      <Stack.Screen
        name="usersList"
        component={UsersListScreen}
        options={{title:"Пользователи"}}
      />
      <Stack.Screen
        name="canvas"
        component={CanvasScreen}
        options={{title:"Infinity canvas"}}
      />

    </Stack.Navigator>
  )
}
