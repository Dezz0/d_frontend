import {
  useCreateApplicationApplicationsPost,
  useGetDictionariesApplicationsDictionariesGet,
  useGetMyApplicationsApplicationsMyGet,
} from '@/shared/api/generated/applications/applications'
import { Alert } from 'react-native'
import { useState } from 'react'
import { useAuthStore } from '@/store/authStore'
import { useGetCurrentUserInfoAuthMeGet } from '@/shared/api/generated/auth/auth'

type RoomConfiguration = {
  id: number
  selectedRoomId: number | null
  sensorIds: number[]
}

export const useCreateApplication = () => {
  const { data: dictionaries, isLoading: isLoadingDictionaries } =
    useGetDictionariesApplicationsDictionariesGet({ query: { retry: false } })

  // Хук для получения данных пользователя
  const { refetch: fetchUserInfo, isFetching: isFetchingUser } =
    useGetCurrentUserInfoAuthMeGet({
      query: {
        enabled: false,
        retry: false,
      },
    })

  const { refetch: fetchApplications } = useGetMyApplicationsApplicationsMyGet()

  const setUser = useAuthStore(state => state.setUser)

  // Мутация для создания заявки
  const createApplicationMutation = useCreateApplicationApplicationsPost({
    mutation: {
      onSuccess: async () => {
        try {
          // После успешного создания заявки получаем обновленные данные пользователя и список заявок
          const userResponse = await fetchUserInfo()
          await fetchApplications()

          if (userResponse.data) {
            // Обновляем пользователя в сторе
            setUser(userResponse.data)

            Alert.alert(
              'Успех',
              'Заявка успешно создана и отправлена на рассмотрение.',
              [
                {
                  text: 'OK',
                  onPress: () => {
                    // Сброс формы
                    setRooms([
                      { id: Date.now(), selectedRoomId: null, sensorIds: [] },
                    ])
                  },
                },
              ],
            )
          } else {
            throw new Error('Failed to get user data')
          }
        } catch (error) {
          console.error('Error fetching user data:', error)
          Alert.alert(
            'Заявка создана',
            'Заявка успешно создана, но произошла ошибка при обновлении статуса.',
            [
              {
                text: 'OK',
                onPress: () => {
                  setRooms([
                    { id: Date.now(), selectedRoomId: null, sensorIds: [] },
                  ])
                },
              },
            ],
          )
        }
      },
      onError: (error: any) => {
        console.error('Create application error:', error)

        let errorMessage = 'Ошибка при создании заявки. Попробуйте еще раз.'

        if (error?.status === 400) {
          if (error?.data?.detail?.includes('Invalid room ID')) {
            errorMessage = 'Выбрана недопустимая комната'
          } else if (error?.data?.detail?.includes('Invalid sensor ID')) {
            errorMessage = 'Выбран недопустимый датчик'
          } else if (
            error?.data?.detail?.includes('Room not in selected rooms')
          ) {
            errorMessage = 'Датчики выбраны для несуществующей комнаты'
          } else if (
            error?.data?.detail?.includes('Admin cannot create applications')
          ) {
            errorMessage = 'Администратор не может создавать заявки'
          } else {
            errorMessage = error?.data?.detail || 'Неверные данные для заявки'
          }
        } else if (error?.status === 401) {
          errorMessage = 'Необходимо авторизоваться'
        } else if (error?.status === 403) {
          errorMessage = 'Недостаточно прав'
        } else if (error?.status >= 500) {
          errorMessage = 'Сервер временно недоступен'
        }

        Alert.alert('Ошибка', errorMessage)
      },
    },
  })

  const [rooms, setRooms] = useState<RoomConfiguration[]>([
    { id: Date.now(), selectedRoomId: null, sensorIds: [] },
  ])

  // Преобразование словарей для PickerInput
  const roomOptions = dictionaries
    ? Object.entries(dictionaries.rooms).map(([id, name]) => ({
        label: name,
        value: parseInt(id),
      }))
    : []

  const sensorOptions = dictionaries
    ? Object.entries(dictionaries.sensors).map(([id, name]) => ({
        label: name,
        value: parseInt(id),
      }))
    : []

  // Добавить новую комнату
  const handleAddRoom = () => {
    setRooms([
      ...rooms,
      { id: Date.now(), selectedRoomId: null, sensorIds: [] },
    ])
  }

  // Удалить комнату
  const handleRemoveRoom = (roomIndex: number) => {
    if (rooms.length > 1) {
      const newRooms = rooms.filter((_, index) => index !== roomIndex)
      setRooms(newRooms)
    } else {
      Alert.alert('Внимание', 'Должна быть хотя бы одна комната')
    }
  }

  // Изменить выбранную комнату
  const handleRoomChange = (roomIndex: number, roomId: number) => {
    const newRooms = [...rooms]
    newRooms[roomIndex].selectedRoomId = roomId
    // Сбрасываем датчики при смене комнаты
    newRooms[roomIndex].sensorIds = []
    setRooms(newRooms)
  }

  // Добавить датчик к комнате
  const handleAddSensor = (roomIndex: number) => {
    const newRooms = [...rooms]
    // Добавляем пустой датчик (значение будет выбрано позже)
    newRooms[roomIndex].sensorIds.push(-1)
    setRooms(newRooms)
  }

  // Изменить датчик
  const handleSensorChange = (
    roomIndex: number,
    sensorIndex: number,
    sensorId: number,
  ) => {
    const newRooms = [...rooms]
    newRooms[roomIndex].sensorIds[sensorIndex] = sensorId
    setRooms(newRooms)
  }

  // Удалить датчик
  const handleRemoveSensor = (roomIndex: number, sensorIndex: number) => {
    const newRooms = [...rooms]
    newRooms[roomIndex].sensorIds.splice(sensorIndex, 1)
    setRooms(newRooms)
  }

  // Сбросить форму
  const resetForm = () => {
    setRooms([{ id: Date.now(), selectedRoomId: null, sensorIds: [] }])
  }

  // Отправить заявку
  const handleSubmit = () => {
    // Валидация
    const errors: string[] = []

    rooms.forEach((room, index) => {
      if (!room.selectedRoomId) {
        errors.push(`Комната #${index + 1}: не выбрана комната`)
        return
      }

      // Проверяем, что все датчики выбраны (если они есть)
      room.sensorIds.forEach((sensorId, sensorIndex) => {
        if (sensorId === -1) {
          errors.push(
            `Комната #${index + 1}: не выбран датчик #${sensorIndex + 1}`,
          )
        }
      })
    })

    // Проверяем дублирование комнат
    const roomIds = rooms.map(room => room.selectedRoomId).filter(Boolean)

    // Проверяем, что есть хотя бы одна комната
    const activeRooms = roomIds.filter(Boolean)
    if (activeRooms.length === 0) {
      errors.push('Выберите хотя бы одну комнату')
    }

    if (errors.length > 0) {
      Alert.alert('Ошибка валидации', errors.join('\n'))
      return
    }

    // Подготавливаем данные для отправки
    const selectedRooms = rooms
      .map(room => room.selectedRoomId!)
      .filter(Boolean)
    const sensorsMap: Record<string, number[]> = {} // Используем строковые ключи

    rooms.forEach(room => {
      if (room.selectedRoomId) {
        // Фильтруем только выбранные датчики (не -1)
        const validSensorIds = room.sensorIds.filter(id => id !== -1)

        // Используем строковый ключ для совместимости с беком
        const roomKey = room.selectedRoomId.toString()
        sensorsMap[roomKey] = validSensorIds
      }
    })

    const roomsConfig = rooms
        .filter(room => room.selectedRoomId)
        .map(room => ({
          room_id: room.selectedRoomId!,
          sensor_ids: room.sensorIds.filter(id => id !== -1)
        }));

    createApplicationMutation.mutate({
      data: {
        rooms_config: roomsConfig
      }
    });
  }

  const isLoading =
    isLoadingDictionaries ||
    createApplicationMutation.isPending ||
    isFetchingUser

  return {
    isLoadingDictionaries,
    isLoading,
    rooms,
    roomOptions,
    sensorOptions,
    handleRemoveRoom,
    handleRoomChange,
    handleSensorChange,
    handleRemoveSensor,
    handleAddSensor,
    handleAddRoom,
    handleSubmit,
    resetForm,
    createApplicationMutation,
  }
}
