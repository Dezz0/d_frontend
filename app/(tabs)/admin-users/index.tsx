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
import { router } from 'expo-router'

import { formatDate } from '@/shared/utils/format-date'
import { Header } from '@/app/(tabs)/components/header'
import { StatsGrid } from '@/app/(tabs)/components/stats-grid'
import { useGetAllUsersUsersAdminListGet } from '@/shared/api/generated/users/users'

export default function AdminUsersScreen() {
  const insets = useSafeAreaInsets()
  const { data: users, isLoading, error } = useGetAllUsersUsersAdminListGet()

  const handleUserPress = (userId: number, disablePress: boolean) => {
    if (disablePress) return
    router.push(`/admin-users/${userId}`)
  }

  if (isLoading) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Загрузка пользователей...</Text>
        </View>
      </View>
    )
  }

  if (error) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <Header title="Управление пользователями" showLogout={false} />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Ошибка загрузки пользователей</Text>
          <Text style={styles.errorSubtext}>Попробуйте обновить страницу</Text>
        </View>
      </View>
    )
  }

  const userStats = users
    ? [
        { value: users.length.toString(), label: 'Всего' },
        {
          value: users.filter(u => u.is_admin).length.toString(),
          label: 'Администраторов',
        },
        {
          value: users.filter(u => !u.is_admin).length.toString(),
          label: 'Пользователей',
        },
      ]
    : []

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
        <Header title="Управление пользователями" showLogout={false} />

        <StatsGrid stats={userStats} />

        <Text style={styles.sectionTitle}>Список пользователей</Text>

        {users && users.length > 0 ? (
          users.map(user => (
            <TouchableOpacity
              key={user.id}
              style={styles.userCard}
              onPress={() => handleUserPress(user.id, user.is_admin)}
            >
              <View style={styles.userInfo}>
                <View style={styles.userHeader}>
                  <Text style={styles.userName}>{user.login}</Text>
                  {user.is_admin && (
                    <View style={styles.adminBadge}>
                      <Text style={styles.adminBadgeText}>Админ</Text>
                    </View>
                  )}
                </View>
                {!user.is_admin && (
                  <View style={styles.userStats}>
                    <View style={styles.statItem}>
                      <Text style={styles.statValue}>
                        {user.applications_count}
                      </Text>
                      <Text style={styles.statLabel}>Всего заявок</Text>
                    </View>
                    <View style={styles.statItem}>
                      <Text style={[styles.statValue, styles.pendingValue]}>
                        {user.pending_applications}
                      </Text>
                      <Text style={styles.statLabel}>В ожидании</Text>
                    </View>
                    <View style={styles.statItem}>
                      <Text style={[styles.statValue, styles.approvedValue]}>
                        {user.approved_applications}
                      </Text>
                      <Text style={styles.statLabel}>Одобрено</Text>
                    </View>
                    <View style={styles.statItem}>
                      <Text style={[styles.statValue, styles.rejectedValue]}>
                        {user.rejected_applications}
                      </Text>
                      <Text style={styles.statLabel}>Отклонено</Text>
                    </View>
                  </View>
                )}
                <View style={styles.userMeta}>
                  <View
                    style={[
                      styles.statusBadge,
                      {
                        backgroundColor: user.is_active ? '#4CD964' : '#FF3B30',
                      },
                    ]}
                  >
                    <Text style={styles.statusText}>
                      {user.is_active ? 'Активен' : 'Неактивен'}
                    </Text>
                  </View>
                  {user.created_at && (
                    <Text style={styles.createdDate}>
                      Создан: {formatDate(user.created_at)}
                    </Text>
                  )}
                </View>
              </View>
              {!user.is_admin && (
                <View style={styles.arrowContainer}>
                  <Text style={styles.arrow}>→</Text>
                </View>
              )}
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Пользователи не найдены</Text>
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
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginTop: 24,
    marginBottom: 16,
  },
  userCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  userInfo: {
    flex: 1,
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginRight: 8,
  },
  adminBadge: {
    backgroundColor: '#007AFF',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  adminBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
  userStats: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 12,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  pendingValue: {
    color: '#FA8C16',
  },
  approvedValue: {
    color: '#52C41A',
  },
  rejectedValue: {
    color: '#FF4D4F',
  },
  statLabel: {
    fontSize: 10,
    color: '#666',
    marginTop: 2,
  },
  userMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 11,
    fontWeight: '600',
  },
  createdDate: {
    fontSize: 11,
    color: '#999',
  },
  arrowContainer: {
    marginLeft: 8,
  },
  arrow: {
    fontSize: 16,
    color: '#999',
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
})
