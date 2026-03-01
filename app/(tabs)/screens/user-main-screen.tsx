import React, { useState } from 'react'
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { router } from 'expo-router'
import {
  useGetRoomDevicesRoomsRoomIdDevicesGet,
  useGetUserRoomsRoomsUserRoomsGet
} from '@/shared/api/generated/rooms/rooms'
import { useGetLatestOutdoorTemperatureOutdoorTemperatureLatestGet } from '@/shared/api/generated/outdoor-temperature/outdoor-temperature'

export const UserMainScreen: React.FC = () => {
  const {
    data: rooms,
    isLoading: roomsLoading,
    error: roomError,
  } = useGetUserRoomsRoomsUserRoomsGet()

  const {
    data: outdoorTemp,
    isLoading: tempLoading,
    error: tempError,
  } = useGetLatestOutdoorTemperatureOutdoorTemperatureLatestGet({
    query: { refetchInterval: 10000 },
  })
  console.log(rooms?.find(room => room.id === 4))
  const [expandedRooms, setExpandedRooms] = useState<number[]>([])

  const toggleRoom = (roomId: number) => {
    setExpandedRooms(prev =>
      prev.includes(roomId)
        ? prev.filter(id => id !== roomId)
        : [...prev, roomId],
    )
  }

  const handleSensorPress = (
    sensorType: string,
    sensorId: number,
    roomName: string,
  ) => {
    router.push(
      `/sensor/${sensorType}/${sensorId}?room=${encodeURIComponent(roomName)}`,
    )
  }

  const getSensorIcon = (type: string) => {
    switch (type) {
      case 'temperature':
        return '🌡️'
      case 'light':
        return '💡'
      case 'gas':
        return '⚠️'
      case 'humidity':
        return '💧'
      case 'ventilation':
        return '🌬️'
      default:
        return '📱'
    }
  }

  const getSensorDisplayName = (type: string) => {
    switch (type) {
      case 'temperature':
        return 'Температура'
      case 'light':
        return 'Освещение'
      case 'gas':
        return 'Газ'
      case 'humidity':
        return 'Влажность'
      case 'ventilation':
        return 'Вентиляция'
      default:
        return 'Датчик'
    }
  }

  if (roomsLoading || tempLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Загрузка данных...</Text>
      </View>
    )
  }

  if (roomError || tempError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>Ошибка загрузки</Text>
        <Text style={styles.errorText}>
          Не удалось загрузить данные о комнатах или температуре.
        </Text>
      </View>
    )
  }

  if (!rooms || rooms.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>🏠</Text>
        <Text style={styles.emptyTitle}>Нет активных комнат</Text>
        <Text style={styles.emptyText}>
          У вас пока нет настроенных комнат и датчиков.
        </Text>
        <Text style={styles.emptySubtext}>
          После одобрения заявки ваши комнаты и датчики появятся здесь.
        </Text>
      </View>
    )
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* ------------------- Внешняя температура ------------------- */}
      {outdoorTemp && (
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>Температура вокруг дома</Text>
          <Text style={styles.infoText}>
            Минимальная: {outdoorTemp.min_temperature}°C
          </Text>
          <Text style={styles.infoText}>
            Максимальная: {outdoorTemp.max_temperature}°C
          </Text>
          {outdoorTemp.temperatures.length > 0 && (
            <View style={{ marginTop: 8 }}>
              {outdoorTemp.temperatures.map((item, index) => (
                <Text key={`${item.side}-${index}`} style={styles.infoText}>
                  {item.side}: {item.value}°C
                </Text>
              ))}
            </View>
          )}
        </View>
      )}
      {/* ------------------- Комнаты и датчики ------------------- */}
      <View style={styles.roomsSection}>
        <Text style={styles.title}>Комнаты и датчики</Text>
        <Text style={styles.sectionDescription}>
          Нажмите на комнату, чтобы увидеть датчики
        </Text>

        {rooms.map((room, index) => {
          const isExpanded = expandedRooms.includes(room.id)
          const sensorsCount = room.sensors?.length || 0

          return (
            <View key={`${room.id}-${index}`} style={styles.roomCard}>
              <TouchableOpacity
                style={styles.roomHeader}
                onPress={() => toggleRoom(room.id)}
                activeOpacity={0.7}
              >
                <View style={styles.roomInfo}>
                  <Text style={styles.roomName}>{room.name}</Text>
                  <Text style={styles.sensorsCount}>
                    {sensorsCount}{' '}
                    {sensorsCount === 1
                      ? 'датчик'
                      : sensorsCount >= 2 && sensorsCount <= 4
                        ? 'датчика'
                        : 'датчиков'}
                  </Text>
                </View>
                <View style={styles.roomArrow}>
                  {isExpanded ? <Text>Скрыть</Text> : <Text>Показать</Text>}
                </View>
              </TouchableOpacity>

              {isExpanded && sensorsCount > 0 && (
                <View style={styles.sensorsList}>
                  {room.sensors?.map((sensor, index) => (
                    <TouchableOpacity
                      key={`${sensor.id}-${index}`}
                      style={styles.sensorItem}
                      onPress={() =>
                        handleSensorPress(sensor.type, sensor.id, room.name)
                      }
                      activeOpacity={0.6}
                    >
                      <View style={styles.sensorIcon}>
                        <Text style={styles.sensorIconText}>
                          {getSensorIcon(sensor.type)}
                        </Text>
                      </View>
                      <View style={styles.sensorInfo}>
                        <Text style={styles.sensorName}>
                          {getSensorDisplayName(sensor.type)}
                        </Text>
                      </View>
                      <View style={styles.sensorArrow}>
                        <Text style={styles.sensorArrowText}>→</Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {isExpanded && sensorsCount === 0 && (
                <View style={styles.noSensorsContainer}>
                  <Text style={styles.noSensorsText}>
                    В этой комнате нет датчиков
                  </Text>
                </View>
              )}
            </View>
          )
        })}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 32,
    borderRadius: 10,
  },
  content: {
    padding: 2,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF3B30',
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  roomsSection: {
    marginBottom: 24,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  roomCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  roomHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  roomInfo: {
    flex: 1,
  },
  roomName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  sensorsCount: {
    fontSize: 14,
    color: '#6B7280',
  },
  roomArrow: {
    marginLeft: 12,
  },
  sensorsList: {
    backgroundColor: '#F9FAFB',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  sensorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  sensorIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  sensorIconText: {
    fontSize: 20,
  },
  sensorInfo: {
    flex: 1,
  },
  sensorName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 2,
  },
  sensorId: {
    fontSize: 12,
    color: '#6B7280',
  },
  sensorArrow: {
    marginLeft: 8,
  },
  sensorArrowText: {
    fontSize: 18,
    color: '#9CA3AF',
  },
  noSensorsContainer: {
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    alignItems: 'center',
  },
  noSensorsText: {
    fontSize: 14,
    color: '#9CA3AF',
    fontStyle: 'italic',
  },
  infoSection: {
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2563EB',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#3B82F6',
    marginBottom: 4,
    lineHeight: 20,
  },
})
