'use client'
import { useRouter } from 'solito/navigation'
import { XStack, Button, ScrollView } from 'tamagui'
import { Platform, KeyboardAvoidingView } from 'react-native'
import { H4 } from 'tamagui'
import { getBaseUrl } from 'app/utils/util'
import { useState } from 'react'
import { YStack, SizableText, Spinner } from 'tamagui'
import { CreateField } from './components/CreationField'
import { useUserStore } from 'app/stores/store'



export function UserCreationScreen() {

	const { back } = useRouter()
	const [formData, setFormData] = useState<any>({
		role: 'USER'
	})
	const triggerRefresh = useUserStore((s) => s.triggerRefresh)
	const [loading, setLoading] = useState(false)

	const handleCreate = async () => {
		if (!formData.name || !formData.email || !formData.password) {
			alert("Заполните имя, email и пароль")
			return
		}

		setLoading(true)
		try {
			const res = await fetch(`${getBaseUrl()}/api/auth/signup`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(formData)
			})
			const data = await res.json()
			if (res.ok) {
				triggerRefresh()
				alert('Пользователь создан успешно!')
				back()
			} else {
				const data = await res.json()
				alert(`Ошибка: ${data.error}`)
			}
		} catch (err) {
			console.log(err)
			alert("Ошибка сети при создании пользователя")
		} finally {
			setLoading(false)
		}
	}

	return (
		<KeyboardAvoidingView
			style={{ flex: 1 }}
			behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
			keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 40} 
		>
			<ScrollView
				contentContainerStyle={{ flexGrow: 1 }}
				bg="$background"
				keyboardShouldPersistTaps="handled"
				automaticallyAdjustKeyboardInsets={true}
				keyboardDismissMode="on-drag"
			>
				{Platform.OS === "web" ? (
					<XStack p="$4" jc="space-between" ai="center" bbw={1} bc="$borderColor">
						<H4>Панель создания пользователя</H4>
						<Button m="$4"
							color="$orange10" bg="$orange5"
							animation="bouncy"
							onPress={() => back()}>
							Вернуться на главную
						</Button>
					</XStack>
				) : null}
				<YStack
					pb={Platform.OS !== 'web' ? 150 : 0}
					jc="center" f={1} p="$4" space="$4" ai="center"
					mt={Platform.OS !== 'web' ? "$0" : 0}
				>
					<SizableText size="$7" fow="bold">Новый пользователь</SizableText>

					<CreateField
						label="Имя"
						field="name"
						formData={formData}
						setFormData={setFormData}
					/>

					<CreateField
						label="Email"
						field="email"
						formData={formData}
						setFormData={setFormData}
					/>

					<CreateField
						label="Роль (ADMIN или USER)"
						field="role"
						formData={formData}
						setFormData={setFormData}
					/>

					<CreateField
						label="ID Карты"
						field="cardId"
						formData={formData}
						setFormData={setFormData}
					/>

					<CreateField
						label="Пароль"
						field="password"
						isPassword={true}
						formData={formData}
						setFormData={setFormData}
					/>

					<Button
						mt="$6"
						theme="active"
						width={200}
						onPress={handleCreate}
						disabled={loading}
					>
						{loading ? <Spinner color="white" /> : "Создать пользователя"}
					</Button>

					{Platform.OS !== 'web' && (
						<Button mt="$6" variant="outline" bg="$red8" width={200} onPress={() => back()}>
							Отмена
						</Button>
					)}
				</YStack>
				<YStack height={Platform.OS === 'ios' ? 100 : 40} />
			</ScrollView>
		</KeyboardAvoidingView>
	)
}
