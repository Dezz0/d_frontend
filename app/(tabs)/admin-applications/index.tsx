import React from 'react'
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { router } from 'expo-router'

import {
  useGetAllApplicationsApplicationsAdminAllGet,
  useGetDictionariesApplicationsDictionariesGet,
} from '@/shared/api/generated/applications/applications'
import { ApplicationResponse } from '@/shared/api/generated/model'
import { Header } from '@/app/(tabs)/components/header'
import { formatDate } from '@/shared/utils/format-date'

export default function AdminApplicationsScreen() {
  const insets = useSafeAreaInsets()

  const { data: dictionaries, isLoading: loadingDictionaries } =
    useGetDictionariesApplicationsDictionariesGet({
      query: {
        retry: false,
      },
    })

  const {
    data: applicationsData,
    isLoading: loadingApplications,
    isError,
    refetch,
  } = useGetAllApplicationsApplicationsAdminAllGet({
    query: {
      refetchOnMount: true,
      refetchOnWindowFocus: true,
      staleTime: 0,
      gcTime: 0,
    },
  })

  const applications = applicationsData || []
  const loading = loadingDictionaries || loadingApplications

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return '#FFCC00'
      case 'review':
        return '#007AFF'
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
        return 'Ожидает'
      case 'review':
        return 'На проверке'
      case 'approved':
        return 'Одобрена'
      case 'rejected':
        return 'Отклонена'
      default:
        return 'Неизвестно'
    }
  }

  const handleApplicationPress = (application: ApplicationResponse) => {
    router.push({
      pathname: '/(tabs)/admin-applications/[id]',
      params: {
        id: application.id,
      },
    })
  }

  if (loading) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Загрузка заявок...</Text>
        </View>
      </View>
    )
  }

  if (isError) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Ошибка при загрузке заявок</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => refetch()}
          >
            <Text style={styles.retryButtonText}>Повторить</Text>
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
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={loadingApplications}
            onRefresh={() => refetch()}
          />
        }
      >
        <Header
          title="Заявки на умные дома"
          showLogout={false}
          subtitle={`Всего: ${applications.length}`}
        />

        <View style={styles.stats}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {applications.filter(a => a.status === 'pending').length}
            </Text>
            <Text style={styles.statLabel}>Ожидают</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {applications.filter(a => a.status === 'approved').length}
            </Text>
            <Text style={styles.statLabel}>Одобрено</Text>
          </View>
        </View>

        {applications.map(application => (
          <TouchableOpacity
            key={application.id}
            style={styles.applicationCard}
            onPress={() => handleApplicationPress(application)}
            activeOpacity={0.7}
          >
            <View style={styles.applicationHeader}>
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{application.user_login}</Text>
                <Text style={styles.applicationDate}>
                  {formatDate(application.created_at)}
                </Text>
              </View>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusColor(application.status) },
                ]}
              >
                <Text style={styles.statusText}>
                  {getStatusText(application.status)}
                </Text>
              </View>
            </View>

            {application.rooms && dictionaries && (
              <View style={styles.applicationDetails}>
                <Text style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Комнат: </Text>
                  {application.rooms.length}
                </Text>
                <Text style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Датчиков: </Text>
                  {Object.values(application.sensors).flat(Infinity).length} шт.
                </Text>
              </View>
            )}

            <View style={styles.applicationFooter}>
              <Text style={styles.viewDetailsText}>
                Нажмите для просмотра и действий →
              </Text>
            </View>
          </TouchableOpacity>
        ))}

        {applications.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateIcon}>📋</Text>
            <Text style={styles.emptyStateTitle}>Нет заявок</Text>
            <Text style={styles.emptyStateText}>
              Заявки от пользователей пока не поступали
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
    marginBottom: 8,
  },
  errorSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statItem: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  applicationCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  applicationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  applicationDate: {
    fontSize: 14,
    color: '#666',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 80,
    alignItems: 'center',
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  applicationDetails: {
    marginBottom: 12,
  },
  detailItem: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  detailLabel: {
    fontWeight: '500',
    color: '#333',
  },
  applicationFooter: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
  },
  viewDetailsText: {
    fontSize: 14,
    color: '#007AFF',
    textAlign: 'right',
    fontStyle: 'italic',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    maxWidth: 200,
  },
})
