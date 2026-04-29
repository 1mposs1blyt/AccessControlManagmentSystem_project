'use client'

import { SizableText, YStack, XStack, Separator } from "tamagui"
import { useAuthStore, useUserStore } from "app/stores/store" // Добавил useUserStore
import { useMemo, useEffect, useState } from "react"
import { getBaseUrl } from "app/utils/util"

export function UserAttendanceStats() {
	const { user } = useAuthStore()
	
	const refreshSignal = useUserStore((state) => state.refreshSignal)
	
	const [checkins, setCheckins] = useState<any[]>([])

	useEffect(() => {
		const fetchCheckins = async () => {
			if (!user?.id) return
			try {
				const response = await fetch(`${getBaseUrl()}/api/checkin?userId=${user.id}`)
				if (!response.ok) {
					console.error(`Ошибка сервера: ${response.status}`)
					return
				}
				const result = await response.json()
				if (result.success) {
					setCheckins(result.data)
				}
			} catch (error) {
				console.error("Ошибка сети или парсинга:", error)
			}
		}
		fetchCheckins()
	}, [user?.id, refreshSignal]) 

	const stats = useMemo(() => {
		return {
			in: checkins.filter(c => c.type === 'IN').length,
			out: checkins.filter(c => c.type === 'OUT').length,
			none: checkins.filter(c => c.type === 'NONE').length,
		}
	}, [checkins])

	if (!user) return null

	return (
		<XStack
			jc="space-around"
			ai="center"
			py="$4"
			w="100%"
		>
			<YStack ai="center" f={1}>
				<SizableText fontWeight="800" color="$green10" size="$6">
					{stats.in}
				</SizableText>
				<SizableText size="$1" theme="alt2" ta="center" tt="uppercase" lsp={1}>
					Отмечен
				</SizableText>
			</YStack>
			<Separator vertical h={30} />
			<YStack ai="center" f={1}>
				<SizableText fontWeight="800" color="$red10" size="$6">
					{stats.out}
				</SizableText>
				<SizableText size="$1" theme="alt2" ta="center" tt="uppercase" lsp={1}>
					Пропустил
				</SizableText>
			</YStack>
			<Separator vertical h={30} />
			<YStack ai="center" f={1}>
				<SizableText fontWeight="800" color="$gray10" size="$6">
					{stats.none}
				</SizableText>
				<SizableText size="$1" theme="alt2" ta="center" tt="uppercase" lsp={1}>
					Отсутствие
				</SizableText>
			</YStack>
		</XStack>
	)
}
