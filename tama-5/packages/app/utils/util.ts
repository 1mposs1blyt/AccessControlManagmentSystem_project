import { Platform } from "react-native"

export const getBaseUrl = () => {
  if (Platform.OS === 'web') return '' // В вебе оставляем относительный путь
  // Замените на ваш локальный IP для теста на реальном устройстве
  return 'http://10.1.30.203:3000' 
}
