'use client'
import { useRouter } from 'solito/navigation'
import { Button, H1, Paragraph, YStack, Separator, SizableText } from 'tamagui'
// import { ChevronLeft } from '@tamagui/lucide-icons'
import { useState, useEffect } from 'react'
import * as Haptics from 'expo-haptics'
import { Platform } from 'react-native'
export function AboutScreen() {
	const { back } = useRouter()
	const [mounted, setMounted] = useState(false)
	const handlePress = async () => {
		if (Platform.OS !== 'web') {
			try {
				await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft)
			} catch (e) {
				console.log('Вибрация не поддерживается')
			}
		}
	}

	useEffect(() => {
		setMounted(true)
	}, [])

	if (!mounted) return null
	return (
		<YStack f={1} p="$4" bg="$background" gap="$4" jc="center">
			<YStack gap="$2">
				<H1 ta="center" fow="800">О приложении</H1>
				<Separator />
			</YStack>

			<YStack gap="$4">
				<Paragraph fz="$5" ta="center">
					Это кроссплатформенное приложение, построенное на стеке
					<SizableText fow="bold" col="$blue10"> Solito</SizableText> +
					<SizableText fow="bold" col="$red10"> Tamagui</SizableText>.
				</Paragraph>

				<Paragraph theme="alt1" ta="center">
					Один код для Web (Next.js) и Mobile (Expo).
					Полная типизация, общая бизнес-логика и невероятная скорость разработки.
				</Paragraph>
			</YStack>

			<Button
				// icon={ChevronLeft}
				onPress={() => { handlePress(); back() }}
				als="center"
				theme="active"
			>
				Вернуться назад
			</Button>
		</YStack>
	)
}
