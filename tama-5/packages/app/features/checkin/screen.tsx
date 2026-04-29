import React, { useState, useEffect } from 'react'
import { CameraView, useCameraPermissions } from 'expo-camera'
import { Button, YStack, XStack, SizableText, View, Spinner } from 'tamagui'

export function QRScanner({ onScan, onClose }: { onScan: (data: string) => void, onClose: () => void }) {
  const [permission, requestPermission] = useCameraPermissions()
  const [scanned, setScanned] = useState(false)
  const handleBarCodeScanned = React.useCallback(({ data }: { data: string }) => {
    if (scanned) return

    setScanned(true)
    console.log("Сканирование успешно:", data)
    onScan(data)
  }, [scanned, onScan])
  useEffect(() => {
    if (!permission?.granted) {
      requestPermission()
    }
  }, [permission])

  if (!permission) {
    return <YStack mt="$10" jc="center" ai="center"><Spinner size="large" /></YStack>
  }

  if (!permission.granted) {
    return (
      <YStack mt="$6" jc="center" ai="center" bg="$background05">
        <SizableText textAlign="center">Нужен доступ к камере для сканирования</SizableText>
        <Button onPress={requestPermission}>Разрешить</Button>
        <Button chromeless onPress={onClose}>Отмена</Button>
      </YStack>
    )
  }
  return (
    <View mt="$6" jc="center" ai="center" bg="$background05">
      <View
        br="$6"
        ov="hidden"
        bw={2}
        bc="$blue10"
        bg="white"
        width={350}
        height={500}
        pos="relative"

      >
        {permission.granted && (
          <CameraView
            style={{ flex: 1 }}
            facing="back"
            onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
            barcodeScannerSettings={{
              barcodeTypes: ['qr'],
            }}
          />
        )}
        <YStack
          pos="absolute"
          inset={0}
          zIndex={100}
          jc="space-between"
          p="$4"
          pointerEvents="box-none"
        >
          <XStack jc="flex-end">

          </XStack>
          <View
            self="center"
            w={300}
            h={300}
            bw={2}
            bc="$white075"
            br="$4"
            style={{ borderStyle: "dashed" }}
          />

          <YStack mt="$4" bg="$background05" p="$3" br="$4">
            <SizableText color="white" textAlign="center">
              Наведите камеру на QR-код
            </SizableText>
          </YStack>
        </YStack>
      </View>
    </View>
  )
}
