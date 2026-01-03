import React from 'react';
import { StatusCard } from '../components/status-card';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import {
  useGetDictionariesApplicationsDictionariesGet,
  useGetMyApplicationsApplicationsMyGet
} from '@/shared/api/generated/applications/applications';
import { formatDate } from '@/shared/utils/format-date';
import { ApplicationFormScreen } from './application-form-screen';

export const ApplicationStatusScreen: React.FC = () => {
  const {
    data: applications,
    isLoading: isLoadingApplications,
    error: applicationsError
  } = useGetMyApplicationsApplicationsMyGet();

  // Получаем словари для отображения названий комнат и датчиков
  const {
    data: dictionaries,
    isLoading: isLoadingDictionaries
  } = useGetDictionariesApplicationsDictionariesGet({ query: { retry: false } });

  // Объединяем загрузки
  const isLoading = isLoadingApplications || isLoadingDictionaries;

  // Получаем самую свежую заявку (первую в списке)
  const latestApplication = applications && applications.length > 0
    ? applications[0]
    : null;

  const totalSensors = Object.values(latestApplication?.sensors || {})
  .reduce((sum, sensorArray) => sum + sensorArray.length, 0);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Загрузка информации о заявке...</Text>
      </View>
    );
  }

  if (applicationsError) {
    return (
      <View style={styles.errorContainer}>
        <StatusCard
          icon="❌"
          title="Ошибка загрузки"
          message="Не удалось загрузить информацию о заявке. Пожалуйста, попробуйте позже."
          status="rejected"
        />
        <View style={styles.retryContainer}>
          <Text style={styles.retryText}>
            Проверьте подключение к интернету или попробуйте обновить данные
          </Text>
        </View>
      </View>
    );
  }

  if (!latestApplication) {
    return <ApplicationFormScreen />;
  }

  // Функция для получения названия комнаты по ID
  const getRoomName = (roomId: number) => {
    if (!dictionaries?.rooms) return `Комната ${roomId}`;
    return dictionaries.rooms[roomId] || `Комната ${roomId}`;
  };

  // Функция для получения названия датчика по ID
  const getSensorName = (sensorId: number) => {
    if (!dictionaries?.sensors) return `Датчик ${sensorId}`;
    return dictionaries.sensors[sensorId] || `Датчик ${sensorId}`;
  };

  // Функция для получения конфигурации StatusCard в зависимости от статуса
  const getStatusCardConfig = () => {
    switch (latestApplication.status) {
      case 'pending':
        return {
          icon: '⏳',
          title: 'Заявка принята на рассмотрение',
          message: 'Ваша заявка на создание умного дома находится на рассмотрении. Мы свяжемся с вами в ближайшее время для уточнения деталей.',
          status: 'pending' as const
        };
      case 'rejected':
        return {
          icon: '❌',
          title: 'Заявка отклонена',
          message: latestApplication.rejection_comment
            ? `Заявка отклонена. Причина: ${latestApplication.rejection_comment}`
            : 'Ваша заявка была отклонена. Вы можете создать новую заявку.',
          status: 'rejected' as const
        };
      default:
        return {
          icon: '📋',
          title: 'Статус заявки',
          message: `Статус заявки: ${latestApplication.status}`,
          status: 'pending' as const
        };
    }
  };

  const statusCardConfig = getStatusCardConfig();

  return (
    <ScrollView>
      <StatusCard
        icon={statusCardConfig.icon}
        title={statusCardConfig.title}
        message={statusCardConfig.message}
        status={statusCardConfig.status}
        note="Статус: "
      />
      <View style={styles.detailsCard}>
        <Text style={styles.detailsTitle}>Детали заявки #{latestApplication.id}</Text>

        <View style={styles.infoSection}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Номер заявки:</Text>
            <Text style={styles.infoValue}>#{latestApplication.id}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Дата создания:</Text>
            <Text style={styles.infoValue}>{formatDate(latestApplication.created_at)}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Дата обновления:</Text>
            <Text style={styles.infoValue}>{formatDate(latestApplication.updated_at)}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Статус:</Text>
            <View style={[
              styles.statusBadge,
              { backgroundColor: latestApplication.status === 'pending' ? '#FA8C16' : '#FF4D4F' }
            ]}>
              <Text style={styles.statusBadgeText}>
                {latestApplication.status === 'pending' ? 'В обработке' : 'Отклонена'}
              </Text>
            </View>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Количество комнат:</Text>
            <Text style={styles.infoValue}>{latestApplication.rooms.length}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Количество датчиков:</Text>
            <Text style={styles.infoValue}>{totalSensors}</Text>
          </View>
        </View>

        {/* Выбранные комнаты */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Выбранные комнаты:</Text>
          <View style={styles.listContainer}>
            {latestApplication.rooms.map((roomId, index) => (
              <View key={roomId} style={styles.listItem}>
                <Text style={styles.listItemText}>
                  {index + 1}. {getRoomName(roomId)}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Датчики по комнатам */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Распределение датчиков:</Text>
          {Object.entries(latestApplication.sensors).map(([roomId, sensorIds]) => {
            const roomName = getRoomName(parseInt(roomId));
            return (
              <View key={roomId} style={styles.roomSection}>
                <Text style={styles.roomTitle}>
                  {roomName}:
                </Text>
                {sensorIds.length > 0 ? (
                  <View style={styles.sensorsList}>
                    {sensorIds.map((sensorId, index) => (
                      <View key={sensorId} style={styles.sensorItem}>
                        <Text style={styles.sensorText}>
                          {index + 1}. {getSensorName(sensorId)}
                        </Text>
                      </View>
                    ))}
                  </View>
                ) : (
                  <Text style={styles.noItemsText}>Нет выбранных датчиков</Text>
                )}
              </View>
            );
          })}

          {latestApplication.rooms.map(roomId => {
            const roomIdStr = roomId.toString();
            if (!latestApplication.sensors[roomIdStr] || latestApplication.sensors[roomIdStr].length === 0) {
              return (
                <View key={roomId} style={styles.roomSection}>
                  <Text style={styles.roomTitle}>
                    {getRoomName(roomId)}:
                  </Text>
                  <Text style={styles.noItemsText}>Нет выбранных датчиков</Text>
                </View>
              );
            }
            return null;
          })}
        </View>

        {/* Примечание в зависимости от статуса */}
        <View style={[
          styles.noteSection,
          latestApplication.status === 'pending' && styles.notePending,
          latestApplication.status === 'rejected' && styles.noteRejected
        ]}>
          <Text style={styles.noteTitle}>
            {latestApplication.status === 'pending' ? 'Что дальше?' : 'Что делать дальше?'}
          </Text>
          <Text style={styles.noteText}>
            {latestApplication.status === 'pending'
              ? 'Наш специалист свяжется с вами в течение 24 часов для согласования дальнейших действий по настройке умного дома.'
              : 'Вы можете создать новую заявку, скорректировав конфигурацию по своему усмотрению.'}
          </Text>
        </View>
      </View>

      {/* Показываем форму для создания новой заявки, если текущая отклонена */}
      {latestApplication.status === 'rejected' && (
        <View style={styles.newApplicationSection}>
          <Text style={styles.newApplicationTitle}>Создать новую заявку</Text>
          <Text style={styles.newApplicationText}>
            Ваша предыдущая заявка была отклонена. Вы можете создать новую заявку с учетом замечаний или изменить
            конфигурацию.
          </Text>
          <View style={styles.formContainer}>
            <ApplicationFormScreen />
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 200
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666'
  },
  errorContainer: {
    padding: 16
  },
  retryContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#FEF2F2',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FECACA'
  },
  retryText: {
    fontSize: 14,
    color: '#DC2626',
    textAlign: 'center'
  },
  noDataContainer: {
    padding: 16
  },
  detailsCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 20,
    textAlign: 'center'
  },
  infoSection: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB'
  },
  infoLabel: {
    fontSize: 14,
    color: '#6B7280'
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937'
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 80,
    alignItems: 'center'
  },
  statusBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600'
  },
  section: {
    marginBottom: 24
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12
  },
  listContainer: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12
  },
  listItem: {
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6'
  },
  listItemText: {
    fontSize: 14,
    color: '#4B5563'
  },
  roomSection: {
    marginBottom: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12
  },
  roomTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8
  },
  sensorsList: {
    marginLeft: 4
  },
  sensorItem: {
    paddingVertical: 4
  },
  sensorText: {
    fontSize: 13,
    color: '#6B7280'
  },
  noItemsText: {
    fontSize: 13,
    color: '#9CA3AF',
    fontStyle: 'italic',
    marginLeft: 4
  },
  noteSection: {
    marginTop: 8,
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4
  },
  notePending: {
    backgroundColor: '#FFF9E6',
    borderLeftColor: '#FA8C16'
  },
  noteRejected: {
    backgroundColor: '#FFF1F0',
    borderLeftColor: '#FF4D4F'
  },
  noteTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 8
  },
  noteText: {
    fontSize: 13,
    lineHeight: 18
  },
  newApplicationSection: {
    marginTop: 24,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB'
  },
  newApplicationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center'
  },
  newApplicationText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20
  },
  formContainer: {
    marginTop: 8
  }
});
