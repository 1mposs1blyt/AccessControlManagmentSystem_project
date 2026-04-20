import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Platform } from 'react-native'

interface AuthState {
  isAuthenticated: boolean
  user: any | null
  login: (userData: any) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      login: (userData) => set({ isAuthenticated: true, user: userData }),
      logout: () => set({ isAuthenticated: false, user: null }),
    }),
    {
      name: 'auth-storage', // уникальное имя ключа в хранилище
      storage: createJSONStorage(() =>
        Platform.OS === 'web' ? localStorage : AsyncStorage
      ),
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user ? {
          id: state.user.id,
          role: state.user.role,
          name: state.user.name,
        } : null,
      }),
    }
  )
)
