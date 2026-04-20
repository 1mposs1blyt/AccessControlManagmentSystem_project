import { TextInput, useWindowDimensions } from 'react-native'
import { YStack, ZStack, Text, Image, XStack, Button } from 'tamagui'
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler'
import Animated, { useSharedValue, useAnimatedStyle, withDecay, clamp, useDerivedValue, useAnimatedProps, withTiming, withSpring } from 'react-native-reanimated'
import { useState } from 'react'

export function InfiniteCanvas() {
	const AnimatedInput = Animated.createAnimatedComponent(TextInput)
	const CANVAS_SIZE = 2500

	const savedScale = useSharedValue(1) // Чтобы зум не прыгал при повторном касании

	const offset = {
		x: useSharedValue(0),
		y: useSharedValue(0),
	}
	const scale = useSharedValue(1)
	const [elements, setElements] = useState([
		{ id: 1, x: 2500, y: 2500, color: '$blue10' } // Начальный объект
	])
	const addElement = () => {
		const newElement = {
			id: Date.now(), // Уникальный ID
			// Создаем объект примерно там, где сейчас смотрит пользователь
			x: Math.abs(offset.x.value) + 100,
			y: Math.abs(offset.y.value) + 500,
			color: '$red10',
		}
		setElements((prev) => [...prev, newElement])
	}
	const pinchGesture = Gesture.Pinch()
		.onStart(() => {
			// Сохраняем текущий масштаб в начале жеста
			savedScale.value = scale.value
		})
		.onUpdate((event) => {
			scale.value = clamp(savedScale.value * event.scale, 0.3, 3)
		})
		.onEnd(() => {
			savedScale.value = scale.value
			// Если слишком сильно уменьшили, возвращаем к минимуму плавно
			if (scale.value < 0.5) {
				scale.value = withTiming(0.5)
				savedScale.value = 0.5
			}
		})

	const panGesture = Gesture.Pan()
		.onChange((event) => {
			// 1. Просто прибавляем дельту (сколько проехал палец)
			const nextX = offset.x.value + event.changeX
			const nextY = offset.y.value + event.changeY

			// 2. Жесткие границы: не даем уйти за пределы 5000px в любую сторону
			// Используем простые числа, чтобы исключить ошибку в формулах
			offset.x.value = clamp(nextX, -CANVAS_SIZE, CANVAS_SIZE)
			offset.y.value = clamp(nextY, -CANVAS_SIZE, CANVAS_SIZE)
		})
		.onEnd((event) => {
			// Простая инерция без наворотов
			offset.x.value = withDecay({ velocity: event.velocityX })
			offset.y.value = withDecay({ velocity: event.velocityY })
		})
	const combinedGesture = Gesture.Simultaneous(panGesture, pinchGesture)

	const animatedStyle = useAnimatedStyle(() => ({
		transform: [
			{ translateX: offset.x.value },
			{ translateY: offset.y.value },
			{ scale: scale.value },
		],
	}))

	const coordText = useDerivedValue(() => {
		const x = Math.round(Math.abs(offset.x.value))
		const y = Math.round(Math.abs(offset.y.value))
		return `X: ${x}, Y: ${y}`
	})
	const animatedProps = useAnimatedProps(() => {
		return {
			text: coordText.value,
		} as any
	})

	return (
		<GestureHandlerRootView style={[{ flex: 1 }]}>
			<YStack flex={1} backgroundColor="$gray8" overflow="hidden">
				<GestureDetector gesture={combinedGesture}>
					<Animated.View style={[{ flex: 1 }, animatedStyle]}>
						<ZStack width={CANVAS_SIZE} height={CANVAS_SIZE} backgroundColor="$backgroundStrong">

							{/* 1. ФОНОВАЯ СЕТКА (О которой говорили ранее) */}
							<YStack position="absolute" top={0} left={0} width="100%" height="100%">
								<Image
									source={{ uri: 'https://www.google.com/url?sa=t&source=web&rct=j&url=https%3A%2F%2Fwww.dreamstime.com%2Fillustration%2Fdots-background.html&ved=0CBYQjRxqFwoTCNCamJmi-JMDFQAAAAAdAAAAABAF&opi=89978449' }}
									resizeMode="repeat"
									width="100%"
									height="100%"
									opacity={0.2}
								/>
							</YStack>

							{/* 2. ЦЕНТРАЛЬНАЯ ГРУППА ОБЪЕКТОВ */}
							{/* Главная карточка */}
							<YStack
								position="absolute"
								top={80}
								left={50}
								width={300}
								padding="$5"
								backgroundColor="$blue10"
								borderRadius="$6"
								elevation="$4"
								shadowColor="$shadowColor"
							>
								<Text color="white" fontSize={20} fontWeight="bold">Привет, Solito!</Text>
								<Text color="white" opacity={0.8} mt="$2">
									Это твой бесконечный холст. Попробуй подвигать его.
								</Text>
								<XStack justifyContent="space-between" mt="$4" space="$2">
									<Button size="$2" onPress={() => {
										alert("Button works!")
									}}>Кнопка 1</Button>
									<Button size="$2" theme="active" onPress={() => {
										addElement()
									}}>addElement!</Button>
								</XStack>
							</YStack>
							{/* Декоративные круги вокруг для ориентира */}
							{elements.map((el) => (
								<YStack
									key={el.id}
									position="absolute"
									top={el.y}
									left={el.x}
									width={120}
									height={80}
									backgroundColor={el.color}
									borderRadius="$4"
									alignItems="center"
									justifyContent="center"
									elevation="$2"
								>
									<Text color="white">Объект {el.id.toString().slice(-3)}</Text>
								</YStack>
							))}
						</ZStack>
					</Animated.View>
				</GestureDetector>
				<XStack z={99999999999} background="$white5" h={100} w={100}>

				</XStack>
			</YStack>
			<YStack
				position="absolute"
				top={10}
				left={10}
				backgroundColor="$background075"
				padding="$2"
				borderRadius="$2"
				zIndex={1000}
			>
				<AnimatedInput
					editable={false}
					animatedProps={animatedProps}
					style={{ color: 'gray', fontSize: 12, width: 120 }}
					defaultValue={coordText.value}
				/>
			</YStack>
			<YStack
				position="absolute"
				bottom={10}
				right={10}
				zIndex={1000}
			>
				<Button onPress={() => {
					// 1. Плавно возвращаем масштаб к 1
					scale.value = withSpring(1)
					savedScale.value = 1

					// 2. Плавно возвращаем координаты в 0
					// (Или в твои начальные initialX/initialY)
					offset.x.value = withSpring(0)
					offset.y.value = withSpring(0)

				}}>GET BACK</Button>
			</YStack>
		</GestureHandlerRootView>
	)
}