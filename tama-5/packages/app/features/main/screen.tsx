'use client'
import { H1, YStack, Button } from "tamagui"
import { useAuthStore } from "app/features/auth/store"

export function MainScreen() {
    const logout = useAuthStore((state)=>state.logout)
    return (
        <YStack width="100%" height='100%' backgroundColor="$background">
            <H1 color="$color" pb="$4" textAlign="center">Main screen</H1>
            <Button m="$4" onPress={logout}>Logout</Button>
        </YStack>
    )
}
