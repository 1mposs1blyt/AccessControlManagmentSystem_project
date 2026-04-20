'use client'
import { useState } from 'react'
import {
	Button,
	Form,
	H2,
	Input,
	Label,
	Paragraph,
	SizableText,
	YStack,
	AnimatePresence
} from 'tamagui'
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native'
import { getBaseUrl } from 'app/utils/util'
import { useAuthStore } from 'app/features/auth/store'

export function AuthScreen() {
	const setIsAuthenticated = useAuthStore((state) => state.login)
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')
	const handleLogin = async () => {
		setStatus('loading')
		const url = `${getBaseUrl()}/api/auth/signin`
		try {
			const response = await fetch(url, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email, password }),
			})

			const data = await response.json()

			if (!response.ok) {
				throw new Error(data.error || 'Ошибка входа')
			}
			console.log('Успех:', data.user)

			setIsAuthenticated(data.user)

		} catch (err) {
			console.log(err)
			setStatus('error')
		} finally {
			setStatus('idle')
		}
	}


	return (
		<KeyboardAvoidingView
			style={{ flex: 1 }}
			enabled={Platform.OS !== 'web'}
			behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
		>
			<ScrollView
				contentContainerStyle={{ flexGrow: 1 }}
				keyboardShouldPersistTaps="handled"
			>
				<YStack
					f={1}
					jc="center"
					ai="center"
					p="$4"
					space="$4"
					bg="$background"
				>
					<YStack space="$2" bw={0} ai="center">
						<H2>С возвращением</H2>
						<Paragraph color="$colorSubtitle">Введите данные для входа</Paragraph>
					</YStack>

					<YStack width="100%" maxWidth={300} space="$3">
						<YStack>
							<Label fow="700" size="$3" htmlFor="email">Email</Label>
							<Input
								id="email"
								placeholderTextColor="$color9"
								placeholder="example@mail.com"
								value={email}
								onChangeText={setEmail}
								keyboardType="email-address"
								autoCapitalize="none"
								size="$4"
							/>
						</YStack>
						<YStack>
							<Label fow="700" size="$3" htmlFor="password">Пароль</Label>
							<Input
								id="password"
								type="password"
								placeholderTextColor="$color9"
								placeholder="••••••••"
								value={password}
								onChangeText={setPassword}
								secureTextEntry
								size="$4"
							/>
						</YStack>
						<Button
							mt="$2"
							size="$4"
							onPress={handleLogin}
							disabled={status === 'loading'}
							opacity={status === 'loading' ? 0.5 : 1}
						>
							{status === 'loading' ? 'Входим...' : 'Войти'}
						</Button>
					</YStack>

					<SizableText
						size="$2"
						color="$blue10"
						onPress={() => console.log('Forgot password')}
					>
						Забыли пароль?
					</SizableText>
				</YStack>
			</ScrollView>
		</KeyboardAvoidingView>

	)
}
