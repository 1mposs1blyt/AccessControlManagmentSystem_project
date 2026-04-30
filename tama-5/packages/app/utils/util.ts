import { Platform } from "react-native"

export const getBaseUrl = () => {
  if (Platform.OS === 'web') return ''
  if (Platform.OS === "ios") return "http://localhost:3000"
  if (Platform.OS === "android") return "http://10.1.30.210:3000"
  return 'http://10.1.30.210:3000'
}
