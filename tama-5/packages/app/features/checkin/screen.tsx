'use client'
import { YStack } from "tamagui"
import { UserHome } from "./components/UserScreen"


export function CheckinScreen() {
    return (
        <YStack height='100%' backgroundColor="$background">
            <UserHome/>
        </YStack>
    )
}
