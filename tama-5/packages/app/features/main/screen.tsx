'use client'
import { YStack, Button } from "tamagui"
import { useAuthStore } from "app/stores/store"
import { SizableText } from "tamagui"
import { XStack, H4 } from "tamagui"
import { Platform } from "react-native"

import { AdminScreen } from "app/features/admin/screen"
import { CheckinScreen } from "app/features/checkin/screen"

export function MainScreen() {
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  return (
    <YStack f={1} bg="$background">
      {
        Platform.OS === "web" ? (
          <XStack p="$4" jc="space-between" ai="center" bbw={1} bc="$borderColor">
            <H4>Панель доступа</H4>
            {
              user?.role === "ADMIN" ? (
                <SizableText size="$2">Вы вошли как {user?.role == "ADMIN" ? "администратор" : ""}</SizableText>
              ) : null
            }
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
          </XStack>
        ) : null
      }
      <YStack>
        {user?.role === 'ADMIN' ? (
          <AdminScreen />
        ) : (
          <><CheckinScreen /></>
        )}
      </YStack>
    </YStack>
  )
}



