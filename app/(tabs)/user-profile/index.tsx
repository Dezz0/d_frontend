import React, { useState } from 'react'
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useAuthStore } from '@/store/authStore'
import { useUserProfile } from './hooks/use-user-profile'
import { EditProfileModal } from './components/edit-profile-modal'
import { ChangePasswordModal } from './components/change-password-modal'

export default function UserProfileScreen() {
  const insets = useSafeAreaInsets()
  const { user, logout } = useAuthStore()
  const {
    profile,
    isLoading,
    isUpdatingProfile,
    isChangingPassword,
    handleUpdateProfile,
    handleChangePassword,
  } = useUserProfile()

  const [showEditModal, setShowEditModal] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)

  const handleLogout = () => {
    logout()
  }

  const getFullName = () => {
    if (!profile) return user?.login || 'Пользователь'

    const parts = []
    if (profile.last_name) parts.push(profile.last_name)
    if (profile.first_name) parts.push(profile.first_name)
    if (profile.middle_name) parts.push(profile.middle_name)

    return parts.length > 0 ? parts.join(' ') : user?.login || 'Пользователь'
  }

  const getInitials = () => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name.charAt(0)}${profile.last_name.charAt(0)}`.toUpperCase()
    }
    return user?.login?.charAt(0).toUpperCase() || 'U'
  }

  if (isLoading) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Загрузка профиля...</Text>
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
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{getInitials()}</Text>
          </View>
          <Text style={styles.profileName}>{getFullName()}</Text>
          <Text style={styles.profileLogin}>@{user?.login}</Text>
          <Text style={styles.profileRole}>
            {user?.is_admin ? 'Администратор' : 'Пользователь'}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Личная информация</Text>

          {profile?.last_name && (
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Фамилия</Text>
              <Text style={styles.infoValue}>{profile.last_name}</Text>
            </View>
          )}

          {profile?.first_name && (
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Имя</Text>
              <Text style={styles.infoValue}>{profile.first_name}</Text>
            </View>
          )}

          {profile?.middle_name && (
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Отчество</Text>
              <Text style={styles.infoValue}>{profile.middle_name}</Text>
            </View>
          )}

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Логин</Text>
            <Text style={styles.infoValue}>{user?.login || 'Не указан'}</Text>
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Статус</Text>
            <Text style={styles.infoValue}>
              {user?.is_active ? 'Активен' : 'Неактивен'}
            </Text>
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Заявки поданы</Text>
            <Text style={styles.infoValue}>
              {user?.application_submitted ? 'Да' : 'Нет'}
            </Text>
          </View>

          {profile?.created_at && (
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Дата регистрации</Text>
              <Text style={styles.infoValue}>
                {new Date(profile.created_at).toLocaleDateString('ru-RU')}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Действия</Text>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => setShowEditModal(true)}
            disabled={isUpdatingProfile}
          >
            <Text style={styles.actionButtonText}>
              {isUpdatingProfile ? 'Обновление...' : 'Изменить профиль'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => setShowPasswordModal(true)}
            disabled={isChangingPassword}
          >
            <Text style={styles.actionButtonText}>
              {isChangingPassword ? 'Смена...' : 'Сменить пароль'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Выйти из аккаунта</Text>
          </TouchableOpacity>
        </View>

        {profile && (
          <View style={styles.statsSection}>
            <Text style={styles.sectionTitle}>Статистика</Text>

            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>
                  {profile.total_applications}
                </Text>
                <Text style={styles.statLabel}>Всего заявок</Text>
              </View>

              <View style={styles.statCard}>
                <Text style={[styles.statNumber, styles.pendingStat]}>
                  {profile.pending_applications}
                </Text>
                <Text style={styles.statLabel}>В ожидании</Text>
              </View>

              <View style={styles.statCard}>
                <Text style={[styles.statNumber, styles.approvedStat]}>
                  {profile.approved_applications}
                </Text>
                <Text style={styles.statLabel}>Одобрено</Text>
              </View>

              <View style={styles.statCard}>
                <Text style={[styles.statNumber, styles.rejectedStat]}>
                  {profile.rejected_applications}
                </Text>
                <Text style={styles.statLabel}>Отклонено</Text>
              </View>
            </View>

            {profile?.total_rooms !== undefined && profile.total_rooms > 0 && (
              <View style={styles.hardwareStats}>
                <View style={styles.hardwareCard}>
                  <Text style={styles.hardwareNumber}>
                    {profile.total_rooms}
                  </Text>
                  <Text style={styles.hardwareLabel}>Комнат</Text>
                </View>
                <View style={styles.hardwareCard}>
                  <Text style={styles.hardwareNumber}>
                    {profile.total_sensors}
                  </Text>
                  <Text style={styles.hardwareLabel}>Датчиков</Text>
                </View>
              </View>
            )}
          </View>
        )}
      </ScrollView>

      <EditProfileModal
        visible={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSubmit={handleUpdateProfile}
        initialData={{
          first_name: profile?.first_name,
          last_name: profile?.last_name,
          middle_name: profile?.middle_name,
        }}
        isLoading={isUpdatingProfile}
      />

      <ChangePasswordModal
        visible={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        onSubmit={handleChangePassword}
        isLoading={isChangingPassword}
      />
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
  profileHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatarText: {
    color: 'white',
    fontSize: 40,
    fontWeight: 'bold',
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
    textAlign: 'center',
  },
  profileLogin: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  profileRole: {
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoLabel: {
    fontSize: 16,
    color: '#666',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  actionButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginBottom: 10,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  statsSection: {
    marginBottom: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    width: '48%',
    marginBottom: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  pendingStat: {
    color: '#FA8C16',
  },
  approvedStat: {
    color: '#52C41A',
  },
  rejectedStat: {
    color: '#FF4D4F',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
    textAlign: 'center',
  },
  hardwareStats: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginTop: 20,
  },
  hardwareCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    minWidth: 100,
  },
  hardwareNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  hardwareLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
    textAlign: 'center',
  },
})
