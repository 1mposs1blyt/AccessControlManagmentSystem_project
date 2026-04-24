import { YStack, H2, Paragraph, SizableText } from "tamagui";
import { QRScanner } from "./QrScanner";
import { useState } from "react";
import { useAuthStore } from 'app/stores/store'
import { getBaseUrl } from "app/utils/util";
export const UserHome = () => {
  const [showScanner, setShowScanner] = useState(true)
  const user = useAuthStore((state) => state.user)
  if (!user) return null
  return (
    <YStack space="$4" p="$4" ai="center">
      <H2>Мой пропуск</H2>
      <Paragraph>Отсканируй QR для входа!</Paragraph>
      <QRScanner
        onClose={() => (setShowScanner(!showScanner))}
        onScan={async (data) => {
          const url = new URL(data)
          const base64Data = url.searchParams.get('qrdata')
          console.log(base64Data)

          if (base64Data && user?.id) {
            const response = await fetch(`${getBaseUrl()}/api/checkin/qr`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                qrData: base64Data, 
                userId: user.id,     
                type: 'IN'
              })
            })

            const res = await response.json()
            if (res.success) alert('Чекин выполнен!')
          }
        }}
      />
    </YStack>
  )

}