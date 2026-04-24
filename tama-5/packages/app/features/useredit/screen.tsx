'use client'
import { useParams, useRouter } from 'solito/navigation'
import { useEffect, useState } from 'react'
import { YStack, XStack, Input, SizableText, Button, Label, ScrollView, Spinner } from 'tamagui'
import { useUserStore } from 'app/stores/store'
import { Platform } from 'react-native'
import { H4 } from 'tamagui'
import { getBaseUrl } from 'app/utils/util'
const EditField = ({ label, field, currentValue, isPassword = false, formData, setFormData }: any) => (
	<YStack space="$1" width="100%" maxWidth={400}>
		<XStack jc="space-between" ai="center">
			<Label size="$2" theme="alt1">{label}:</Label>
			<SizableText size="$2" color="$colorFocus">
				{isPassword ? "********" : (currentValue || '—')}
			</SizableText>
		</XStack>
		<Input
			size="$3"
			secureTextEntry={isPassword}
			value={formData[field] || ''}
			onChangeText={(text: string) => setFormData({ ...formData, [field]: text })}
			placeholder={`Новое значение...`}

			// Вот эти правки для нормального вида:
			bw={1}                   // Толщина границы
			bc="$borderColor"        // Цвет границы из темы (или "$gray5")
			bg="$background"         // Фон как у всей страницы (белый/темный)
			color="$color"           // Цвет текста из темы
			focusStyle={{            // Стиль при нажатии
				bc: "$blue10",
				bw: 2
			}}
			placeholderTextColor="$gray10" // Чтобы плейсхолдер был серым, а не черным
		/>
	</YStack>
)

export function UserEditScreen({ route }: any) {
	const { push, back } = useRouter()
	const params = useParams<{ id: string }>()
	const rawPath = route?.path || ''

	const id = Platform.OS === 'web'
		? params?.id
		: [
			params?.id,
			route?.params?.id,
			route?.path?.split('/').filter(Boolean).pop(),
			route?.params?.screen
		].find(v => v && v !== 'undefined' && !isNaN(Number(v)))


	console.log('Native route params:', route?.params);
	const [user, setUser] = useState<any>(null)
	const [formData, setFormData] = useState<any>({})
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState()
	const updateUser = useUserStore((state) => state.updateUser)

	useEffect(() => {
		if (!id || id === 'undefined' || isNaN(Number(id))) return

		setLoading(true)
		fetch(`${getBaseUrl()}/api/users/${id}`)
			.then(res => res.json())
			.then(data => {
				if (data) {
					setUser(data)
				}
				setLoading(false)
			}).catch(err => {
				console.error('ОШИБКА FETCH:', err)
				setLoading(false)
			})
	}, [id])

	const handleSave = async () => {
		const dataToSend = Object.fromEntries(
			Object.entries(formData).filter(([_, v]) => v !== "")
		)

		if (Object.keys(dataToSend).length === 0) {
			alert("Нет изменений для сохранения")
			return
		}

		const res = await fetch(`${getBaseUrl()}/api/users/${id}`, {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(dataToSend)
		})

		if (res.ok) {
			const updatedUserFromServer = await res.json()
			updateUser(Number(id), updatedUserFromServer)
			setUser(updatedUserFromServer)
			setFormData({})

			alert('Данные успешно обновлены!')
		} else {
			const errorData = await res.json()
			alert(`Ошибка: ${errorData.error || 'Не удалось сохранить'}`)
		}
	}
	return (
		<ScrollView bg="$background">
			{
				Platform.OS === "web" ? (
					<XStack p="$4" jc="space-between" ai="center" bbw={1} bc="$borderColor">
						<H4>Панель редактирования пользователя</H4>
						<Button m="$4"
							color="$orange10" bg="$orange5"
							animation="bouncy"
							pressStyle={{
								bg: "$orange8",
								scale: 0.99,
								color: "white"
							}}
							hoverStyle={{
								bg: "$orange6",
								scale: 0.99,
								color: "white"
							}}
							onPress={() => push("/")}>
							Вернуться на главную
						</Button>
					</XStack>
				) : null
			}
			<YStack f={1} p="$4" space="$4" ai="center">
				{loading ? (
					<Spinner mt="$10" size="large" />
				) : !user || user.error || user.status === 404 ? (
					// Блок, если пользователь не найден
					<YStack mt="$10" ai="center" space="$2">
						<SizableText size="$8" fow="bold" color="$red10">
							404
						</SizableText>
						<SizableText size="$5" theme="alt2">
							{error || "Пользователь не найден"}
						</SizableText>
						<Button mt="$4" onPress={() => back()}>
							Вернуться назад
						</Button>
					</YStack>
				) : (
					<>
						<SizableText size="$7" fow="bold">
							Редактирование: {user.name}
						</SizableText>
						<EditField
							label="Имя"
							field="name"
							currentValue={user.name}
							formData={formData}
							setFormData={setFormData}
						/>
						<EditField
							label="Email"
							field="email"
							currentValue={user.email}
							formData={formData}
							setFormData={setFormData}
						/>
						<EditField
							label="Роль"
							field="role"
							currentValue={user.role}
							formData={formData}
							setFormData={setFormData}
						/>
						<EditField
							label="ID Карты"
							field="cardId"
							currentValue={user.cardId}
							formData={formData}
							setFormData={setFormData}
						/>
						<EditField
							label="Пароль"
							field="password"
							currentValue=""
							isPassword={true}
							formData={formData}
							setFormData={setFormData}
						/>
						<Button mt="$6" theme="active" width={200} onPress={handleSave}>
							Сохранить изменения
						</Button>
						{
							Platform.OS !== "web" ?
								(
									<Button m="$4"
										color="$orange10" bg="$orange5"
										animation="bouncy"
										pressStyle={{
											bg: "$orange8",
											scale: 0.99,
											color: "white"
										}}
										hoverStyle={{
											bg: "$orange6",
											scale: 0.99,
											color: "white"
										}}
										onPress={() => back()}>
										Вернуться на главную
									</Button>
								) : null
						}
					</>
				)}
			</YStack>
		</ScrollView>
	)

}
