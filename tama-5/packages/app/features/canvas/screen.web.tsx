'use client'
import { useRouter } from 'solito/navigation'
import { Button, H1, YStack, Separator } from 'tamagui'
import { useState, useEffect } from 'react'
export function CanvasScreen() {
	const { push } = useRouter()
	const [mounted, setMounted] = useState(false)

	useEffect(() => {
		setMounted(true)
	}, [])

	if (!mounted) return null
	return (
		<YStack f={1} p="$4" bg="$background" gap="$4" jc="center">
			<YStack gap="$2">
				<H1 ta="center" fow="800">Тут будет canvas</H1>
			</YStack>
			<Button
				onPress={() => { push('/') }}
				als="center"
				theme="active"
			>
				Вернуться назад
			</Button>
		</YStack>
	)
}
