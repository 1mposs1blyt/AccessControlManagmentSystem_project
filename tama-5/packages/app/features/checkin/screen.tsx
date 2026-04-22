'use client'
import { H1,YStack } from "tamagui"
import { UserHome } from "../checkin/components/user/UserScreen"


export function CheckinScreen() {
    return (
        <YStack height='100%' backgroundColor="$background">
            <UserHome/>
        </YStack>
    )
}
