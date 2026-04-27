import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Platform } from 'react-native'
import { AuthState, User, UserState } from 'app/stores/types'



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

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      users: [],
      // Инициализируем нулем
      refreshSignal: 0,

      setUsers: (users) => set({ users }),

      // Метод для "пинка" списка
      triggerRefresh: () => set((state) => ({
        refreshSignal: state.refreshSignal + 1
      })),

      updateUser: (id, data) =>
        set((state) => ({
          users: state.users.map((u) => (u.id === id ? { ...u, ...data } : u)),
        })),
    }),
    {
      name: 'users-storage',
      storage: createJSONStorage(() =>
        Platform.OS === 'web' ? localStorage : AsyncStorage
      ),
      // ВАЖНО: исключи сигнал из сохранения, чтобы он всегда был 0 при запуске
      partialize: (state) => ({ users: state.users }),
    }
  )
)
