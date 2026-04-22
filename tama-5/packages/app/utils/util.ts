import { Platform } from "react-native"

export const getBaseUrl = () => {
  if (Platform.OS === 'web') return ''
  return 'http://192.168.0.100:2146' 
}
