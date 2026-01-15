import React from 'react'
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { router, useLocalSearchParams } from 'expo-router'
import { Header } from '../components/header'
import { formatDate } from '@/shared/utils/format-date'
import { useGetUserApplicationsApplicationsAdminUserIdApplicationsGet } from '@/shared/api/generated/applications/applications'

export default function UserApplicationsScreen() {
  const insets = useSafeAreaInsets()
  const { id: userId } = useLocalSearchParams<{
    id: string
  }>()

  const {
    data: applications,
    isLoading,
    error,
  } = useGetUserApplicationsApplicationsAdminUserIdApplicationsGet(
    parseInt(userId!),
  )

  const handleApplicationPress = (applicationId: number) => {
    router.push(`/admin-applications/${applicationId}`)
  }

  const handleBack = () => {
    router.back()
  }

  if (isLoading) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>
            Загрузка заявок пользователя...
          </Text>
        </View>
      </View>
    )
  }

  if (error) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <Header title="Заявки пользователя" showLogout={false} />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Ошибка загрузки заявок</Text>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Text style={styles.backButtonText}>Назад</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

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
      <ScrollView contentContainerStyle={styles.content}>
        <Header title="Заявки пользователя" showLogout={false} />

        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backButtonText}>
            ← Назад к списку пользователей
          </Text>
        </TouchableOpacity>

        {applications && applications.length > 0 ? (
          <>
            <View style={styles.summarySection}>
              <Text style={styles.summaryTitle}>
                Всего заявок: {applications.length}
              </Text>
              <Text style={styles.summaryText}>
                • В ожидании:{' '}
                {applications.filter(a => a.status === 'pending').length}
              </Text>
              <Text style={styles.summaryText}>
                • Одобрено:{' '}
                {applications.filter(a => a.status === 'approved').length}
              </Text>
              <Text style={styles.summaryText}>
                • Отклонено:{' '}
                {applications.filter(a => a.status === 'rejected').length}
              </Text>
            </View>

            <Text style={styles.sectionTitle}>Список заявок</Text>

            {applications.map(application => (
              <TouchableOpacity
                key={application.id}
                style={styles.applicationCard}
                onPress={() => handleApplicationPress(application.id)}
              >
                <View style={styles.applicationHeader}>
                  <Text style={styles.applicationTitle}>
                    Заявка #{application.id}
                  </Text>
                  <View
                    style={[
                      styles.statusBadge,
                      {
                        backgroundColor:
                          application.status === 'pending'
                            ? '#FA8C16'
                            : application.status === 'approved'
                              ? '#52C41A'
                              : '#FF4D4F',
                      },
                    ]}
                  >
                    <Text style={styles.statusText}>
                      {application.status === 'pending'
                        ? 'В ожидании'
                        : application.status === 'approved'
                          ? 'Одобрена'
                          : 'Отклонена'}
                    </Text>
                  </View>
                </View>

                <View style={styles.applicationInfo}>
                  <Text style={styles.infoText}>
                    Комнат: {application.rooms.length}
                  </Text>
                  <Text style={styles.infoText}>
                    Датчиков: {Object.values(application.sensors).flat().length}
                  </Text>
                </View>

                <View style={styles.applicationFooter}>
                  <Text style={styles.dateText}>
                    Создана: {formatDate(application.created_at)}
                  </Text>
                  <Text style={styles.arrow}>→</Text>
                </View>

                {application.rejection_comment &&
                  application.status === 'rejected' && (
                    <View style={styles.commentBox}>
                      <Text style={styles.commentLabel}>Комментарий:</Text>
                      <Text style={styles.commentText}>
                        {application.rejection_comment}
                      </Text>
                    </View>
                  )}
              </TouchableOpacity>
            ))}
          </>
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>У пользователя нет заявок</Text>
            <Text style={styles.emptyText}>
              Пользователь еще не создавал заявок на умный дом.
            </Text>
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
  summarySection: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  applicationCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  applicationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  applicationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  applicationInfo: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
  },
  applicationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
  },
  dateText: {
    fontSize: 12,
    color: '#999',
  },
  arrow: {
    fontSize: 16,
    color: '#999',
  },
  commentBox: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#FFF1F0',
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#FF4D4F',
  },
  commentLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FF4D4F',
    marginBottom: 4,
  },
  commentText: {
    fontSize: 12,
    color: '#FF4D4F',
    lineHeight: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
})
