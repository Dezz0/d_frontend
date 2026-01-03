import React from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Header } from '@/app/(tabs)/components/header';
import { useGetSensorInfoSensorsSensorTypeSensorIdGet } from '@/shared/api/generated/sensors/sensors';
import { formatDate } from '@/shared/utils/format-date';

export default function SensorDetailScreen() {
  const insets = useSafeAreaInsets();
  const { type: sensorType, id: sensorId } = useLocalSearchParams<{
    type: string;
    id: string
  }>();
  const { room: roomName } = useLocalSearchParams<{
    room?: string
  }>();

  const {
    data,
    isLoading,
    error
  } = useGetSensorInfoSensorsSensorTypeSensorIdGet(sensorType, sensorId, {
    query: {
      enabled: !!sensorType && !!sensorId,
      refetchInterval: 5000,
      retry: false
    }
  });

  const sensorData = data as any;

  const handleBack = () => {
    router.back();
  };

  const getSensorDisplayName = (type: string) => {
    switch (type) {
      case 'temperature':
        return 'Датчик температуры';
      case 'light':
        return 'Датчик освещения';
      case 'gas':
        return 'Датчик газа';
      case 'humidity':
        return 'Датчик влажности';
      case 'ventilation':
        return 'Датчик вентиляции';
      case 'motion':
        return 'Датчик движения';
      default:
        return 'Датчик';
    }
  };

  const getSensorIcon = (type: string) => {
    switch (type) {
      case 'temperature':
        return '🌡️';
      case 'light':
        return '💡';
      case 'gas':
        return '⚠️';
      case 'humidity':
        return '💧';
      case 'ventilation':
        return '🌬️';
      case 'motion':
        return '👣';
      default:
        return '📱';
    }
  };

  const renderSensorData = () => {
    if (!sensorData) return null;

    switch (sensorType) {
      case 'temperature':
        return (
          <View style={styles.sensorDataSection}>
            <Text style={styles.dataLabel}>Температура:</Text>
            <View style={styles.temperatureContainer}>
              <Text style={styles.temperatureValue}>
                {sensorData.value}°C
              </Text>
              <View style={styles.temperatureStatus}>
                {sensorData.value < 18 ? (
                  <Text style={styles.statusCold}>Холодно</Text>
                ) : sensorData.value > 25 ? (
                  <Text style={styles.statusHot}>Жарко</Text>
                ) : (
                  <Text style={styles.statusNormal}>Нормально</Text>
                )}
              </View>
            </View>
          </View>
        );

      case 'light':
        return (
          <View style={styles.sensorDataSection}>
            <Text style={styles.dataLabel}>Состояние:</Text>
            <View style={[
              styles.statusBadge,
              sensorData.is_on ? styles.statusOn : styles.statusOff
            ]}>
              <Text style={styles.statusText}>
                {sensorData.is_on ? 'ВКЛЮЧЕН' : 'ВЫКЛЮЧЕН'}
              </Text>
            </View>
          </View>
        );

      case 'gas':
        return (
          <View style={styles.sensorDataSection}>
            <Text style={styles.dataLabel}>Концентрация CO:</Text>
            <Text style={styles.gasValue}>{sensorData.ppm} ppm</Text>

            <Text style={styles.dataLabel}>Статус:</Text>
            <View style={[
              styles.statusBadge,
              sensorData.status === 'уличный воздух' ? styles.statusSafe :
                sensorData.status === 'рекомендованная концентрация' ? styles.statusWarning :
                  sensorData.status === 'предельная концентрация' ? styles.statusDanger :
                    styles.statusCritical
            ]}>
              <Text style={styles.statusText}>
                {sensorData.status.toUpperCase()}
              </Text>
            </View>
          </View>
        );

      case 'humidity':
        return (
          <View style={styles.sensorDataSection}>
            <Text style={styles.dataLabel}>Уровень влажности:</Text>
            <View style={styles.humidityContainer}>
              <Text style={styles.humidityValue}>
                {sensorData.humidity_level}%
              </Text>
              <View style={styles.humidityBar}>
                <View
                  style={[
                    styles.humidityFill,
                    { width: `${Math.min(sensorData.humidity_level, 100)}%` },
                    sensorData.humidity_level < 30 ? styles.humidityLow :
                      sensorData.humidity_level > 70 ? styles.humidityHigh :
                        styles.humidityNormal
                  ]}
                />
              </View>
            </View>
          </View>
        );

      case 'ventilation':
        return (
          <View style={styles.sensorDataSection}>
            <Text style={styles.dataLabel}>Состояние:</Text>
            <View style={[
              styles.statusBadge,
              sensorData.is_on ? styles.statusOn : styles.statusOff
            ]}>
              <Text style={styles.statusText}>
                {sensorData.is_on ? 'ВКЛЮЧЕНА' : 'ВЫКЛЮЧЕНА'}
              </Text>
            </View>

            <Text style={styles.dataLabel}>Скорость вентилятора:</Text>
            <Text style={styles.fanSpeed}>{sensorData.fan_speed}%</Text>
          </View>
        );

      case 'motion':
        return (
          <View style={styles.sensorDataSection}>
            <Text style={styles.dataLabel}>Последняя активация:</Text>
            <Text style={styles.timeValue}>
              {formatDate(sensorData.trigger_time)}
            </Text>
          </View>
        );

      default:
        return (
          <View style={styles.sensorDataSection}>
            <Text style={styles.dataLabel}>Данные датчика:</Text>
            <Text style={styles.rawData}>
              {JSON.stringify(sensorData, null, 2)}
            </Text>
          </View>
        );
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Загрузка данных датчика...</Text>
        </View>
      </View>
    );
  }

  if (error || !sensorData) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <Header
          title="Ошибка"
          showLogout={false}
        />
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>❌</Text>
          <Text style={styles.errorTitle}>Датчик не найден</Text>
          <Text style={styles.errorText}>
            Не удалось загрузить данные датчика.
          </Text>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Text style={styles.backButtonText}>Назад</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[
      styles.container,
      {
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right
      }
    ]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Header
          title={getSensorDisplayName(sensorType)}
          showLogout={false}
        />

        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backButtonText}>← Назад</Text>
        </TouchableOpacity>

        <View style={styles.sensorHeader}>
          <Text style={styles.sensorIcon}>{getSensorIcon(sensorType)}</Text>
          <Text style={styles.sensorTitle}>
            {getSensorDisplayName(sensorType)}
          </Text>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Информация</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Комната:</Text>
            <Text style={styles.infoValue}>
              {sensorData.room_name || roomName || 'Не указана'}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Тип датчика:</Text>
            <Text style={styles.infoValue}>{getSensorDisplayName(sensorType)}</Text>
          </View>
        </View>

        <View style={styles.dataSection}>
          <View style={styles.dataHeader}>
            <Text style={styles.sectionTitle}>Показания</Text>
          </View>

          <View style={styles.lastUpdate}>
            <Text style={styles.lastUpdateText}>
              Обновляется каждые 5 секунд
            </Text>
          </View>

          {renderSensorData()}
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoBoxTitle}>Справка</Text>
          <Text style={styles.infoBoxText}>
            • Данные обновляются автоматически каждые 5 секунд
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  content: {
    padding: 20,
    paddingBottom: 40
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666'
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 16
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF3B30',
    marginBottom: 8,
    textAlign: 'center'
  },
  errorText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20
  },
  backButton: {
    marginBottom: 20
  },
  backButtonText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500'
  },
  sensorHeader: {
    alignItems: 'center',
    marginBottom: 24
  },
  sensorIcon: {
    fontSize: 64,
    marginBottom: 12
  },
  sensorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
    textAlign: 'center'
  },
  sensorId: {
    fontSize: 14,
    color: '#666'
  },
  infoSection: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },
  infoLabel: {
    fontSize: 14,
    color: '#666'
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333'
  },
  dataSection: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  dataHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  refreshButton: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500'
  },
  lastUpdate: {
    marginBottom: 16
  },
  lastUpdateText: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic'
  },
  sensorDataSection: {
    marginTop: 8
  },
  dataLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8
  },
  temperatureContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  temperatureValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#007AFF'
  },
  temperatureStatus: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20
  },
  statusCold: {
    color: '#3B82F6',
    fontWeight: '600'
  },
  statusNormal: {
    color: '#10B981',
    fontWeight: '600'
  },
  statusHot: {
    color: '#EF4444',
    fontWeight: '600'
  },
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 16
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600'
  },
  statusOn: {
    backgroundColor: '#10B981'
  },
  statusOff: {
    backgroundColor: '#6B7280'
  },
  statusSafe: {
    backgroundColor: '#10B981'
  },
  statusWarning: {
    backgroundColor: '#F59E0B'
  },
  statusDanger: {
    backgroundColor: '#EF4444'
  },
  statusCritical: {
    backgroundColor: '#7C2D12'
  },
  gasValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#EF4444',
    marginBottom: 16
  },
  humidityContainer: {
    marginBottom: 16
  },
  humidityValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3B82F6',
    marginBottom: 8
  },
  humidityBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden'
  },
  humidityFill: {
    height: '100%',
    borderRadius: 4
  },
  humidityLow: {
    backgroundColor: '#3B82F6'
  },
  humidityNormal: {
    backgroundColor: '#10B981'
  },
  humidityHigh: {
    backgroundColor: '#EF4444'
  },
  fanSpeed: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8B5CF6'
  },
  timeValue: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '500'
  },
  rawData: {
    fontSize: 12,
    color: '#666',
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 8,
    fontFamily: 'monospace'
  },
  infoBox: {
    backgroundColor: '#EFF6FF',
    borderRadius: 8,
    padding: 16
  },
  infoBoxTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2563EB',
    marginBottom: 8
  },
  infoBoxText: {
    fontSize: 14,
    color: '#3B82F6',
    marginBottom: 4,
    lineHeight: 20
  }
});
