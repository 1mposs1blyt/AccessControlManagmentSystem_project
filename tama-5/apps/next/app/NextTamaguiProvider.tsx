'use client'

import { TamaguiProvider } from 'tamagui'
import { tamaguiConfig } from '@app/ui/src/tamagui.config'



export const NextTamaguiProvider = ({ children }: { children: React.ReactNode }) => {
    // console.log('DEBUG: Tamagui Config is:', tamaguiConfig)
    if (!tamaguiConfig) {
        return <>{children}</> // Временная заглушка, чтобы не падал Proxy
    }
    return (
        <TamaguiProvider
            config={tamaguiConfig}
            defaultTheme="light"
            disableInjectCSS
        >
            {children}
        </TamaguiProvider>
    )
}