import { TamaguiStyles } from './TamaguiStyles' // Создадим его сейчас
import { NextTamaguiProvider } from './NextTamaguiProvider'
import './globals.css'
import { AuthGuard } from './src/AuthGuard'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        <TamaguiStyles />
      </head>
      <body>
        <NextTamaguiProvider>
          <AuthGuard>{children}</AuthGuard>
        </NextTamaguiProvider>
      </body>
    </html>
  )
}

