import { Platform } from "react-native"

export const getBaseUrl = () => {
  if (Platform.OS === 'web') return ''
  return 'http://10.1.30.205:2146' 
}
