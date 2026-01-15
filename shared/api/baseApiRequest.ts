import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'
import { getAccessToken, refreshToken, removeTokens } from './tokenService'

export interface BaseApiRequestOptions {
  url: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  data?: object
  signal?: AbortSignal
  params?: any
  headers?: Record<string, string>
}

const API_URL = process.env.EXPO_PUBLIC_API_URL

if (!API_URL) {
  console.warn('EXPO_PUBLIC_API_URL is not set')
}

const createApiClient = () => {
  const apiClient = axios.create()

  // Перехватчик для добавления токена к запросам
  apiClient.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      if (
        config.url?.includes('/auth/login') ||
        config.url?.includes('/auth/register')
      ) {
        return config
      }

      const token = await getAccessToken()
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    },
    error => {
      return Promise.reject(error)
    },
  )

  // Перехватчик для обработки ошибок и обновления токена
  apiClient.interceptors.response.use(
    response => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & {
        _retry?: boolean
      }

      if (
        originalRequest.url?.includes('/auth/login') ||
        originalRequest.url?.includes('/auth/register')
      ) {
        return Promise.reject(error)
      }

      // Если ошибка 401 и это не повторная попытка
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true

        try {
          // Пытаемся обновить токен
          const newTokens = await refreshToken()

          // Повторяем оригинальный запрос с новым токеном
          if (newTokens.access_token && originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newTokens.access_token}`
          }

          return apiClient(originalRequest)
        } catch (refreshError) {
          // Если обновление не удалось, удаляем токены
          await removeTokens()
          return Promise.reject(refreshError)
        }
      }

      return Promise.reject(error)
    },
  )

  return apiClient
}

const apiClient = createApiClient()

export const baseApiRequest = async <T>({
  url,
  method = 'GET',
  data,
  signal,
  params,
  headers: addedHeaders = {},
}: BaseApiRequestOptions): Promise<T> => {
  try {
    const filteredParams =
      typeof params === 'object' && !Array.isArray(params)
        ? Object.fromEntries(
            Object.entries(params).filter(([_, value]) => value !== undefined),
          )
        : params

    const urlParams = new URLSearchParams(
      typeof filteredParams === 'number'
        ? filteredParams.toString()
        : filteredParams,
    )

    const response = await apiClient({
      method,
      url: API_URL + url,
      params: urlParams,
      data,
      headers: {
        'Content-Type': 'application/json',
        ...addedHeaders,
      },
      signal,
    })
    return response.data
  } catch (error: any) {
    console.error('❌ API Error:', {
      message: error.message,
      code: error.code,
      url: error.config?.url,
      method: error.config?.method,
      data: error.config?.data,
    })
    throw error
  }
}
