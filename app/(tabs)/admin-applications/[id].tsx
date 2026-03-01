import React from 'react'
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Header } from '@/app/(tabs)/components/header'
import { formatDate } from '@/shared/utils/format-date'
import { useProcessApplication } from './hooks/use-process-application'

export default function ApplicationDetailScreen() {
  const insets = useSafeAreaInsets()

  const {
    handleApprove,
    handleBack,
    handleToggleComment,
    comment,
    handleReject,
    getSensorName,
    loading,
    applicationData,
    showCommentInput,
    setComment,
    updatingStatus,
  } = useProcessApplication()

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return '#FFCC00'
      case 'approved':
        return '#4CD964'
      case 'rejected':
        return '#FF3B30'
      default:
        return '#999'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Ожидает рассмотрения'
      case 'approved':
        return 'Одобрена'
      case 'rejected':
        return 'Отклонена'
      default:
        return 'Неизвестно'
    }
  }

  if (loading) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Загрузка заявки...</Text>
        </View>
      </View>
    )
  }

  if (!applicationData) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Заявка не найдена</Text>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Text style={styles.backButtonText}>Вернуться назад</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  // Подсчитываем общее количество датчиков из rooms_config
  const totalSensors =
    applicationData.rooms_config?.reduce(
      (sum, roomConfig) => sum + (roomConfig.sensor_ids?.length || 0),
      0,
    ) || 0

  console.log('ЗАЯВКА У АДМИНА ---', applicationData?.rooms_config)

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        },
      ]}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Header title={`Заявка #${applicationData.id}`} showLogout={false} />

        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backButtonText}>← Назад к списку</Text>
        </TouchableOpacity>

        <View style={styles.statusSection}>
          <Text style={styles.sectionTitle}>Статус заявки</Text>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(applicationData.status) },
            ]}
          >
            <Text style={styles.statusText}>
              {getStatusText(applicationData.status)}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Информация о пользователе</Text>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Пользователь:</Text>
            <Text style={styles.infoValue}>{applicationData.user_login}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>ID пользователя:</Text>
            <Text style={styles.infoValue}>{applicationData.user_id}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Дата подачи:</Text>
            <Text style={styles.infoValue}>
              {formatDate(applicationData.created_at)}
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Дата обновления:</Text>
            <Text style={styles.infoValue}>
              {formatDate(applicationData.updated_at)}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Конфигурация умного дома</Text>
          <View style={styles.summary}>
            <Text style={styles.summaryItem}>
              • Количество комнат: {applicationData.rooms_config?.length || 0}
            </Text>
            <Text style={styles.summaryItem}>
              • Общее количество датчиков: {totalSensors} шт.
            </Text>
          </View>

          <Text style={styles.roomsTitle}>Конфигурация:</Text>
          {applicationData.rooms_config?.map((roomConfig, index) => (
            <View
              key={`${roomConfig.room_type}-${index}`}
              style={styles.roomCard}
            >
              <Text style={styles.roomTitle}>
                {index + 1}. {roomConfig.room_type}
              </Text>

              {roomConfig.sensor_ids && roomConfig.sensor_ids.length > 0 ? (
                <>
                  <Text style={styles.sensorsTitle}>Датчики:</Text>
                  {roomConfig.sensor_ids.map((sensorId, sensorIndex) => (
                    <Text
                      key={`${sensorId}-${sensorIndex}`}
                      style={styles.sensorItem}
                    >
                      {sensorIndex + 1}. {getSensorName(sensorId)}
                    </Text>
                  ))}
                  <Text style={styles.roomTotal}>
                    Всего датчиков в комнате: {roomConfig.sensor_ids.length} шт.
                  </Text>
                </>
              ) : (
                <Text style={styles.noSensorsText}>Нет датчиков</Text>
              )}
            </View>
          ))}
        </View>

        {applicationData.status === 'pending' && (
          <View style={styles.actionsSection}>
            <Text style={styles.sectionTitle}>Действия с заявкой</Text>

            {showCommentInput && (
              <View style={styles.commentContainer}>
                <Text style={styles.commentLabel}>
                  Комментарий к отклонению (опционально):
                </Text>
                <TextInput
                  style={styles.commentInput}
                  value={comment}
                  onChangeText={setComment}
                  placeholder="Укажите причину отклонения заявки..."
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                />
                <TouchableOpacity
                  style={styles.cancelCommentButton}
                  onPress={handleToggleComment}
                >
                  <Text style={styles.cancelCommentButtonText}>Отмена</Text>
                </TouchableOpacity>
              </View>
            )}

            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.approveButton}
                onPress={handleApprove}
                disabled={updatingStatus}
              >
                {updatingStatus ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  <Text style={styles.approveButtonText}>Одобрить заявку</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.rejectButton}
                onPress={handleReject}
                disabled={updatingStatus}
              >
                {updatingStatus ? (
                  <ActivityIndicator color="white" size="small" />
                ) : showCommentInput ? (
                  <Text style={styles.rejectButtonText}>
                    Подтвердить отклонение
                  </Text>
                ) : (
                  <Text style={styles.rejectButtonText}>Отклонить заявку</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        )}

        {applicationData.status === 'approved' && (
          <View style={styles.successSection}>
            <Text style={styles.successIcon}>✅</Text>
            <Text style={styles.successTitle}>Заявка одобрена</Text>
            <Text style={styles.successText}>
              Заявка была одобрена и передана в отдел реализации. Пользователь
              уведомлен о решении.
            </Text>
          </View>
        )}

        {applicationData.status === 'rejected' && (
          <View style={styles.rejectedSection}>
            <Text style={styles.rejectedIcon}>❌</Text>
            <Text style={styles.rejectedTitle}>Заявка отклонена</Text>
            <Text style={styles.rejectedText}>
              Заявка была отклонена. Пользователь был уведомлен о решении.
            </Text>
            {applicationData.rejection_comment && (
              <View>
                <Text style={styles.rejectedTitle}>Причина:</Text>
                <Text style={styles.rejectedText}>
                  {applicationData.rejection_comment}
                </Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
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
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FF3B30',
    marginBottom: 20,
  },
  backButton: {
    marginBottom: 20,
  },
  backButtonText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusSection: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  statusBadge: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  statusText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    textAlign: 'right',
    flex: 1,
    marginLeft: 10,
  },
  summary: {
    marginBottom: 15,
  },
  summaryItem: {
    fontSize: 14,
    color: '#333',
    marginBottom: 6,
  },
  roomsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  roomCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
  },
  roomTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  sensorsTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginBottom: 6,
    marginTop: 8,
  },
  sensorItem: {
    fontSize: 14,
    color: '#666',
    marginLeft: 10,
    marginBottom: 4,
  },
  noSensorsText: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
    marginTop: 8,
  },
  roomTotal: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  actionsSection: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  commentContainer: {
    marginBottom: 20,
  },
  commentLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  commentInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    backgroundColor: 'white',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  cancelCommentButton: {
    marginTop: 10,
    alignSelf: 'flex-start',
  },
  cancelCommentButtonText: {
    fontSize: 14,
    color: '#666',
    textDecorationLine: 'underline',
  },
  actionButtons: {
    gap: 10,
  },
  approveButton: {
    backgroundColor: '#4CD964',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
  },
  approveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  rejectButton: {
    backgroundColor: '#FF3B30',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
  },
  rejectButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  successSection: {
    backgroundColor: '#F6FFED',
    borderRadius: 12,
    padding: 30,
    marginBottom: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#B7EB8F',
  },
  successIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#52C41A',
    marginBottom: 8,
    textAlign: 'center',
  },
  successText: {
    fontSize: 14,
    color: '#52C41A',
    textAlign: 'center',
    lineHeight: 20,
  },
  rejectedSection: {
    backgroundColor: '#FFF1F0',
    borderRadius: 12,
    padding: 30,
    marginBottom: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFA39E',
  },
  rejectedIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  rejectedTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF4D4F',
    marginBottom: 8,
    textAlign: 'center',
  },
  rejectedText: {
    fontSize: 14,
    color: '#FF4D4F',
    textAlign: 'center',
    lineHeight: 20,
  },
})
