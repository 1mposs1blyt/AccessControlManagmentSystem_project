import { SafeArea } from 'app/provider/safe-area'
import { NavigationProvider } from './navigation'

export function Provider({ children }: { children: React.ReactNode }) {
  return (
    <SafeArea>
      <NavigationProvider>{children as any}</NavigationProvider>
    </SafeArea>
  )
}
