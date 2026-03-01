import { useState } from 'react'
import { router, useLocalSearchParams } from 'expo-router'
import {
  useGetApplicationApplicationsApplicationIdGet,
  useGetDictionariesApplicationsDictionariesGet,
  useUpdateApplicationStatusApplicationsApplicationIdPut,
} from '@/shared/api/generated/applications/applications'
import { Alert } from 'react-native'

// Тип для конфигурации комнаты
type RoomConfig = {
  room_id: number
  sensor_ids: number[]
}

// Тип для ответа от API (обновленный)
type ApplicationResponse = {
  id: number
  user_id: number
  user_login: string
  rooms_config: RoomConfig[]  // Изменено с rooms и sensors
  status: 'pending' | 'approved' | 'rejected'
  rejection_comment?: string
  created_at: string
  updated_at: string
}

export const useProcessApplication = () => {
  const { id: applicationId } = useLocalSearchParams<{
    id: string
  }>()

  const [comment, setComment] = useState('')
  const [showCommentInput, setShowCommentInput] = useState(false)

  // Загружаем справочники
  const { data: dictionaries, isLoading: loadingDictionaries } =
      useGetDictionariesApplicationsDictionariesGet({ query: { retry: false } })

  // Загружаем детали заявки
  const {
    data: applicationData,
    isLoading: loadingApplication,
    refetch: refetchApplication,
  } = useGetApplicationApplicationsApplicationIdGet(parseInt(applicationId!))

  // Мутация для обновления статуса
  const { mutate: updateStatus, isPending: updatingStatus } =
      useUpdateApplicationStatusApplicationsApplicationIdPut()

  const loading = loadingApplication || loadingDictionaries

  const getRoomName = (roomId: number) => {
    if (!dictionaries?.rooms) return `Комната ${roomId}`
    return dictionaries.rooms[roomId] || `Комната ${roomId}`
  }

  const getSensorName = (sensorId: number) => {
    if (!dictionaries?.sensors) return `Датчик ${sensorId}`
    return dictionaries.sensors[sensorId] || `Датчик ${sensorId}`
  }

  // Вспомогательная функция для подсчета общего количества датчиков
  const getTotalSensors = (roomsConfig?: RoomConfig[]) => {
    if (!roomsConfig) return 0
    return roomsConfig.reduce((sum, room) => sum + (room.sensor_ids?.length || 0), 0)
  }

  // Вспомогательная функция для получения всех комнат с их датчиками в плоском виде (для обратной совместимости, если нужно)
  const getRoomsWithSensors = (roomsConfig?: RoomConfig[]) => {
    if (!roomsConfig) return { rooms: [], sensors: {} }

    const rooms: number[] = []
    const sensors: Record<string, number[]> = {}

    roomsConfig.forEach((config, index) => {
      rooms.push(config.room_id)
      // Используем индекс для создания уникального ключа, если нужно различать одинаковые комнаты
      sensors[`${config.room_id}_${index}`] = config.sensor_ids || []
    })

    return { rooms, sensors }
  }

  const handleApprove = () => {
    if (!applicationData) return

    Alert.alert(
        'Подтверждение одобрения',
        'Вы уверены, что хотите одобрить эту заявку?',
        [
          { text: 'Отмена', style: 'cancel' },
          {
            text: 'Одобрить',
            style: 'default',
            onPress: () => {
              updateStatus(
                  {
                    applicationId: applicationData.id,
                    data: {
                      status: 'approved',
                      rejection_comment: undefined,
                    },
                  },
                  {
                    onSuccess: () => {
                      refetchApplication().then(() => {
                        Alert.alert('Успех', 'Заявка одобрена')
                      })
                    },
                    onError: (error: any) => {
                      console.error('Update status error:', error)
                      let errorMessage = 'Не удалось обновить статус заявки'

                      if (error?.status === 400) {
                        errorMessage = 'Некорректные данные'
                      } else if (error?.status === 403) {
                        errorMessage = 'Недостаточно прав'
                      } else if (error?.status === 404) {
                        errorMessage = 'Заявка не найдена'
                      }

                      Alert.alert('Ошибка', errorMessage)
                    },
                  },
              )
            },
          },
        ],
    )
  }

  const handleReject = () => {
    if (!applicationData) return

    if (!showCommentInput) {
      setShowCommentInput(true)
      return
    }

    Alert.alert(
        'Подтверждение отклонения',
        'Вы уверены, что хотите отклонить эту заявку?',
        [
          { text: 'Отмена', style: 'cancel' },
          {
            text: 'Отклонить',
            style: 'destructive',
            onPress: () => {
              updateStatus(
                  {
                    applicationId: applicationData.id,
                    data: {
                      status: 'rejected',
                      rejection_comment: comment || undefined,
                    },
                  },
                  {
                    onSuccess: () => {
                      refetchApplication().then(() => {
                        Alert.alert('Отклонено', 'Заявка отклонена')
                        setShowCommentInput(false)
                        setComment('')
                      })
                    },
                    onError: (error: any) => {
                      console.error('Update status error:', error)
                      let errorMessage = 'Не удалось обновить статус заявки'

                      if (error?.status === 400) {
                        errorMessage = 'Некорректные данные'
                      } else if (error?.status === 403) {
                        errorMessage = 'Недостаточно прав'
                      } else if (error?.status === 404) {
                        errorMessage = 'Заявка не найдена'
                      }

                      Alert.alert('Ошибка', errorMessage)
                    },
                  },
              )
            },
          },
        ],
    )
  }

  const handleBack = () => {
    router.replace('/admin-applications')
  }

  const handleToggleComment = () => {
    setShowCommentInput(!showCommentInput)
    if (showCommentInput) {
      setComment('')
    }
  }

  return {
    handleBack,
    handleApprove,
    handleReject,
    handleToggleComment,
    comment,
    getRoomName,
    getSensorName,
    loading,
    applicationData: applicationData as ApplicationResponse | undefined,
    showCommentInput,
    setComment,
    updatingStatus,
    // Добавляем вспомогательные функции для использования в компоненте
    getTotalSensors,
    getRoomsWithSensors,
  }
}