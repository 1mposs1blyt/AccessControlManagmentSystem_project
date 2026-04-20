import * as React from 'react'
import { useColorScheme } from 'react-native'
import { TamaguiProvider, Theme } from 'tamagui'
import config from '@app/ui/src/tamagui.config' // проверь путь!
import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native'

export const ExpoTamaguiProvider = ({ children }: { children: React.ReactNode }) => {
    const colorScheme = useColorScheme()


    return (
        <TamaguiProvider config={config} defaultTheme={colorScheme === 'dark' ? "dark" : 'light'}>
            <Theme name={colorScheme}>
                <NavigationContainer>
                    <>{children}</>
                </NavigationContainer>
            </Theme>
        </TamaguiProvider>
    )
}
