import AsyncStorage from '@react-native-async-storage/async-storage'
import { useAuthStore } from '@/store/authStore'
import { refreshTokenAuthRefreshPost } from '@/shared/api/generated/auth/auth'
import type { RefreshToken } from '@/shared/api/generated/model'

const ACCESS_TOKEN_KEY = 'access_token'
const REFRESH_TOKEN_KEY = 'refresh_token'

// Сохранение токенов
export const setTokens = async (
  accessToken: string,
  refreshToken: string,
): Promise<void> => {
  await AsyncStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
  await AsyncStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
}

// Получение access токена
export const getAccessToken = async (): Promise<string | null> => {
  return await AsyncStorage.getItem(ACCESS_TOKEN_KEY)
}

// Получение refresh токена
export const getRefreshToken = async (): Promise<string | null> => {
  return await AsyncStorage.getItem(REFRESH_TOKEN_KEY)
}

// Удаление токенов
export const removeTokens = async (): Promise<void> => {
  await AsyncStorage.multiRemove([ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY])
  useAuthStore.getState().logout()
}

// Функция обновления токена
export const refreshToken = async (): Promise<{
  access_token: string
  refresh_token: string
}> => {
  const refreshTokenValue = await getRefreshToken()

  if (!refreshTokenValue) {
    throw new Error('No refresh token available')
  }

  const data = await refreshTokenAuthRefreshPost({
    refresh_token: refreshTokenValue,
  } as RefreshToken)

  if (data.access_token && data.refresh_token) {
    await setTokens(data.access_token, data.refresh_token)
    return data
  } else {
    throw new Error('Invalid response from refresh endpoint')
  }
}
