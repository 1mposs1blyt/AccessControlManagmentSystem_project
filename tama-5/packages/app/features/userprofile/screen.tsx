'use client'

import { SizableText, YStack, XStack, Avatar, Button, Card, H3, Separator, Theme } from "tamagui"
import { useAuthStore, useUserStore } from "app/stores/store"
import { User as UserIcon, Shield, QrCode, X } from '@tamagui/lucide-icons'
import { Platform } from "react-native"
import { UserAttendanceStats } from "./components/UserAttendance"
import { useEffect, useState } from "react"
import { Sheet } from "tamagui"
import { getBaseUrl } from "app/utils/util"
import { H2, Paragraph } from "tamagui"
import { QRScanner } from "app/features/checkin/screen"
export function UserProfileScreen() {
  const [isProcessing, setIsProcessing] = useState(false)
  const { user } = useAuthStore()
  const refreshSignal = useUserStore((state) => state.refreshSignal)
  const triggerRefresh = useUserStore((state) => state.triggerRefresh)
  const [checkins, setCheckins] = useState([])
  useEffect(() => {
    let isMounted = true // Флаг, чтобы не обновлять стейт, если компонент размонтирован

    const fetchCheckins = async () => {
      if (!user?.id) return

      const response = await fetch(`${getBaseUrl()}/api/checkin?userId=${user.id}`)
      const result = await response.json()

      if (result.success && isMounted) {
        setCheckins(result.data)
      }
    }

    fetchCheckins()

    return () => { isMounted = false } // Чистим за собой
  }, [user?.id, refreshSignal])
  const [isScannerOpen, setScannerOpen] = useState(false)
  const [showScanner, setShowScanner] = useState(true)

  return (
    <YStack backgroundColor="$background" p="$4">
      <YStack space="$4" maw={600} als="center" w="100%">
        <Card p="$5" borderRadius="$9">
          <XStack space="$4" ai="center">
            <Avatar circular size="$8" bw={2} bc="$blue8">
              <Avatar.Fallback bc="$blue10" jc="center" ai="center">
                <UserIcon size={32} />
              </Avatar.Fallback>
            </Avatar>
            <YStack ml="$2" f={1}>
              <H3 lh="$1" textTransform="capitalize">{user.name}</H3>
              <XStack ai="center" space="$2" mt="$1" opacity={0.6}>
                <Shield size={14} color="$blue10" />
                <SizableText size="$3" tt="uppercase" lsp={1}>{user.role}</SizableText>
              </XStack>
            </YStack>
          </XStack>
          <Separator my="$4" />
          <UserAttendanceStats />
        </Card>
        <Button
          mt="$4"
          size="$5"
          theme="blue"
          icon={QrCode}
          onPress={() => setScannerOpen(true)}
          br="$6"
          animation="quick"
          hoverStyle={{ scale: 0.98 }}
          pressStyle={{ scale: 0.95 }}
        >
          Сканировать QR-код
        </Button>
        <SizableText size="$1" theme="alt1" ta="center" mt="$4" opacity={0.5}>
          Версия приложения: 1.0.0 • {Platform.OS.toUpperCase()}
        </SizableText>
        <Sheet
          modal
          open={isScannerOpen}
          onOpenChange={setScannerOpen}
          dismissOnSnapToBottom
          zIndex={100000}
          animation="medium"
        >
          <Sheet.Overlay
            animation="lazy"
            enterStyle={{ opacity: 0 }}
            exitStyle={{ opacity: 0 }}
          />
          <Sheet.Frame p="$4" jc="center" ai="center" space="$4">
            <Sheet.Handle />

            <XStack w="100%" jc="flex-end">
              <Button
                size="$3"
                circular
                icon={X}
                onPress={() => setScannerOpen(false)}
              />
            </XStack>

            <YStack f={1} w="100%" ai="center" jc="center">
              {isScannerOpen && (
                <YStack space="$4" p="$4" ai="center">
                  <H2>Мой пропуск</H2>
                  <Paragraph>Отсканируй QR для входа!</Paragraph>
                  <QRScanner
                    onClose={() => (setShowScanner(!showScanner))}
                    onScan={async (data) => {
                      if (isProcessing) return
                      try {
                        setIsProcessing(true)
                        const base64Data = data.includes('qrdata=')
                          ? data.split('qrdata=')[1]
                          : null

                        console.log("Extracted Base64:", base64Data)

                        if (base64Data && user?.id) {
                          const response = await fetch(`${getBaseUrl()}/api/checkin`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              qrData: base64Data,
                              userId: user.id,
                              type: 'IN',
                              createdAt: new Date().toISOString()
                            })
                          })

                          const res = await response.json()

                          if (res.success) {
                            triggerRefresh()
                            setScannerOpen(false)
                            setShowScanner(false)
                          } else {
                            alert(`Ошибка: ${res.error || 'Не удалось отметиться'}`)
                          }
                        } else {
                          setScannerOpen(false)
                          setShowScanner(false)
                          alert("Ошибка чтения QR-кода!\nПопробуйте еще раз!")
                        }
                      } catch (error) {
                        console.error("Ошибка при сканировании:", error)
                        alert("Произошла ошибка при обработке кода")
                      } finally {
                        setIsProcessing(false)
                      }
                    }}
                  />
                </YStack>)}
            </YStack>
          </Sheet.Frame>
        </Sheet>
      </YStack>
    </YStack>
  )
}