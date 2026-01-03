import { Alert } from 'react-native';
import { useAuthStore } from '@/store/authStore';
import {
  useChangePasswordAuthChangePasswordPost,
  useGetUserProfileAuthProfileGet,
  useUpdateUserProfileAuthProfilePut
} from '@/shared/api/generated/auth/auth';

export const useUserProfile = () => {
  const { user, setUser } = useAuthStore();

  // Получение профиля
  const {
    data: profileData,
    isLoading: isLoadingProfile,
    error: profileError,
    refetch: refetchProfile
  } = useGetUserProfileAuthProfileGet({
    query: {
      enabled: !!user,
      retry: false
    }
  });

  // Обновление профиля
  const {
    mutate: updateProfile,
    isPending: isUpdatingProfile
  } = useUpdateUserProfileAuthProfilePut({
    mutation: {
      onSuccess: async (data) => {
        await refetchProfile();

        Alert.alert('Успех', 'Профиль успешно обновлен');
        // Обновляем пользователя в сторе
        if (setUser && data) {
          setUser(data);
        }
      },
      onError: (error: any) => {
        console.error('Update profile error:', error);
        let errorMessage = 'Ошибка обновления профиля';

        if (error?.status === 400) {
          errorMessage = 'Некорректные данные';
        } else if (error?.status === 401) {
          errorMessage = 'Необходимо авторизоваться';
        }

        Alert.alert('Ошибка', errorMessage);
      }
    }
  });

  // Смена пароля
  const {
    mutate: changePassword,
    isPending: isChangingPassword
  } = useChangePasswordAuthChangePasswordPost({
    mutation: {
      onSuccess: async () => {
        await refetchProfile();
        Alert.alert('Успех', 'Пароль успешно изменен');
      },
      onError: (error: any) => {
        console.error('Change password error:', error);
        let errorMessage = 'Ошибка смены пароля';

        if (error?.status === 400) {
          if (error?.data?.detail?.includes('Old password is incorrect')) {
            errorMessage = 'Старый пароль неверен';
          } else {
            errorMessage = 'Некорректные данные';
          }
        } else if (error?.status === 401) {
          errorMessage = 'Необходимо авторизоваться';
        }

        Alert.alert('Ошибка', errorMessage);
      }
    }
  });

  const handleUpdateProfile = (data: {
    first_name?: string;
    last_name?: string;
    middle_name?: string;
  }) => {
    updateProfile({ data });
  };

  const handleChangePassword = (oldPassword: string, newPassword: string) => {
    changePassword({
      data: {
        old_password: oldPassword,
        new_password: newPassword
      }
    });
  };

  return {
    profile: profileData,
    isLoading: isLoadingProfile,
    error: profileError,
    isUpdatingProfile,
    isChangingPassword,
    handleUpdateProfile,
    handleChangePassword
  };
};
