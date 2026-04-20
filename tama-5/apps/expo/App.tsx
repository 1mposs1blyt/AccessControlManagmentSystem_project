import { ExpoTamaguiProvider } from './src/ExpoTamaguiProvider' // путь к вашему новому файлу
import { NativeNavigation } from 'app/navigation/native'

export default function App() {
  return (
    <ExpoTamaguiProvider>
      <NativeNavigation />
    </ExpoTamaguiProvider>
  )
}
