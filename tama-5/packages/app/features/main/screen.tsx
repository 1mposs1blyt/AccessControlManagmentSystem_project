'use client'
import { H1, YStack, Button } from "tamagui"
import { useAuthStore } from "app/features/auth/store"
import { H2, Paragraph, SizableText } from "tamagui"
import { ScrollView } from "react-native"
import { XStack, H4 } from "tamagui"
import { Platform } from "react-native"
export function MainScreen() {
	const user = useAuthStore((state) => state.user)
	const logout = useAuthStore((state) => state.logout)
	return (
		<YStack f={1} bg="$background">
			{/* Общая шапка для всех */}
			{
				Platform.OS === "web" ? (
			<XStack p="$4" jc="space-between" ai="center" bbw={1} bc="$borderColor">
				<H4>Панель доступа</H4>
				{
					user?.role === "ADMIN" ? (<SizableText size="$2">Вы вошли как {user?.role == "ADMIN" ? "администратор":""}</SizableText>) : null
				}
			</XStack>
				) : null
			}


			{/* Условный контент на основе роли */}
			<ScrollView>
				{user?.role === 'ADMIN' ? (
					<AdminDashboard />
				) : (
					<UserHome />
				)}
				<Button m="$4" onPress={logout}>Logout</Button>

			</ScrollView>

		</YStack>
	)
}
const AdminDashboard = () => (
	<YStack space="$4" p="$4">
		<H2>Панель администратора</H2>
		<Paragraph>Список всех пользователей системы:</Paragraph>
		{/* Здесь будет ваш список из БД */}
		<Button onPress={() => alert("Будет реализовано позже")}>Добавить пользователя</Button>
	</YStack>
)

// Компонент для обычного пользователя
const UserHome = () => (
	<YStack space="$4" p="$4" ai="center">
		<H2>Мой пропуск</H2>
		<Paragraph>Ваш QR-код для прохода:</Paragraph>
		<YStack bw={2} p="$4" br="$4">
			{/* Здесь будет QR */}
			<SizableText>QR CODE PLACEHOLDER</SizableText>
		</YStack>
	</YStack>
)