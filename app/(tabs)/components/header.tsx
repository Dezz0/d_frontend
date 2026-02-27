import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useAuthStore } from '@/store/authStore'
import { router } from 'expo-router'
import { useQueryClient } from '@tanstack/react-query'

interface HeaderProps {
  title?: string
  showLogout?: boolean
  hideUserName?: boolean
  subtitle?: string
}

export const Header: React.FC<HeaderProps> = ({
  title,
  showLogout = true,
  hideUserName = false,
  subtitle,
}) => {
  const queryClient = useQueryClient()
  const { user, logout } = useAuthStore()

  const hasFullName = user?.first_name && user?.last_name

  const handleLogout = () => {
    queryClient.clear()
    queryClient.removeQueries()

    logout()
    router.replace('/login')
  }

  return (
    <View style={styles.header}>
      <View>
        {title && <Text style={styles.title}>{title}</Text>}
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        {!subtitle && !hideUserName && user && (
          <Text style={styles.userName}>
            {hasFullName ? `${user.last_name} ${user.first_name}` : user.login}
          </Text>
        )}
      </View>
      {showLogout && (
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Выйти</Text>
        </TouchableOpacity>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 4,
  },
  userName: {
    fontSize: 20,
    color: '#6B7280',
    marginTop: 4,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#EF4444',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
})
