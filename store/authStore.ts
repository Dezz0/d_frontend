import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { UserResponse } from '@/shared/api/generated/model'

interface AuthState {
  accessToken: string | null
  refreshToken: string | null
  user: UserResponse | null
  isAuthenticated: boolean
  login: (accessToken: string, refreshToken: string, user: any) => void
  logout: () => void
  setTokens: (accessToken: string, refreshToken: string) => void
  setUser: (user: any) => void
  updateAccessToken: (accessToken: string) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    set => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,
      login: (accessToken: string, refreshToken: string, user: any) =>
        set({ accessToken, refreshToken, user, isAuthenticated: true }),
      logout: () =>
        set({
          accessToken: null,
          refreshToken: null,
          user: null,
          isAuthenticated: false,
        }),
      setTokens: (accessToken: string, refreshToken: string) =>
        set({ accessToken, refreshToken }),
      setUser: (user: any) => set({ user }),
      updateAccessToken: (accessToken: string) => set({ accessToken }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
)
