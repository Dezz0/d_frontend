import { useState } from 'react';
import { Alert } from 'react-native';
import { router } from 'expo-router';
import { useRegisterAuthRegisterPost } from '@/shared/api/generated/auth/auth';

export const useRegister = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Хук для регистрации
  const registerMutation = useRegisterAuthRegisterPost({
    mutation: {
      onSuccess: () => {
        Alert.alert(
          'Успех',
          'Регистрация прошла успешно! Теперь вы можете войти в систему.',
          [
            {
              text: 'OK',
              onPress: () => router.replace('/login')
            }
          ]
        );
      },
      onError: (error: any) => {
        console.error('Registration error:', error);

        let errorMessage = 'Ошибка регистрации. Попробуйте еще раз.';

        if (error?.status === 400) {
          if (error?.data?.detail === 'User with this login already exists') {
            errorMessage = 'Пользователь с таким логином уже существует';
          } else {
            errorMessage = 'Неверные данные для регистрации';
          }
        } else if (error?.status >= 500) {
          errorMessage = 'Сервер временно недоступен';
        }

        Alert.alert('Ошибка', errorMessage);
      }
    }
  });

  const handleRegister = () => {
    // Валидация
    if (!email || !password || !confirmPassword) {
      Alert.alert('Внимание', 'Пожалуйста, заполните все поля');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Внимание', 'Пароли не совпадают');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Внимание', 'Пароль должен содержать минимум 6 символов');
      return;
    }

    // Вызываем мутацию регистрации
    registerMutation.mutate({
      data: {
        login: email,
        password: password
      }
    });
  };

  const isLoading = registerMutation.isPending;

  return {
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    handleRegister,
    isLoading
  };
};
