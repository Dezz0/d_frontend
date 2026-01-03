import { useState } from 'react';
import { Alert } from 'react-native';
import { useAuthStore } from '@/store/authStore';
import { router } from 'expo-router';
import { setTokens } from '@/shared/api/tokenService';
import { useGetCurrentUserInfoAuthMeGet, useLoginAuthLoginPost } from '@/shared/api/generated/auth/auth';

export const useAuth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const login = useAuthStore((state) => state.login);

  // Хук для получения данных пользователя
  const {
    refetch: fetchUserInfo,
    isFetching: isFetchingUser
  } = useGetCurrentUserInfoAuthMeGet({
    query: {
      enabled: false,
      retry: false
    }
  });

  // Хук для логина
  const loginMutation = useLoginAuthLoginPost({
    mutation: {
      onSuccess: async (loginData) => {
        try {
          // Сохраняем токены
          await setTokens(loginData.access_token, loginData.refresh_token);

          // Получаем информацию о пользователе
          const userResponse = await fetchUserInfo();

          if (userResponse.data) {
            // Обновляем стор с полученными данными
            login(
              loginData.access_token,
              loginData.refresh_token,
              userResponse.data
            );

            router.replace('/(tabs)');
          } else {
            throw new Error('Failed to get user data');
          }
        } catch (error) {
          console.error('Error in login process:', error);
          Alert.alert('Ошибка', 'Ошибка при получении данных пользователя');
        }
      },
      onError: (error: any) => {
        console.error('Login error:', error);

        let errorMessage = 'Ошибка авторизации. Проверьте логин и пароль';

        if (error?.status === 401) {
          errorMessage = 'Неверный логин или пароль';
        } else if (error?.status >= 500) {
          errorMessage = 'Сервер временно недоступен';
        }

        Alert.alert('Ошибка', errorMessage);
      }
    }
  });

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('Внимание', 'Пожалуйста, заполните все поля');
      return;
    }

    // Вызываем мутацию логина
    loginMutation.mutate({
      data: {
        login: email,
        password: password
      }
    });
  };

  const isLoading = loginMutation.isPending || isFetchingUser;

  return {
    email,
    setEmail,
    password,
    setPassword,
    handleLogin,
    isLoading
  };
};
