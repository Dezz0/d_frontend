import React from 'react'
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { RelativePathString, router } from 'expo-router'
import { Header } from '../components/header'

export const AdminHomeScreen: React.FC = () => {
  const adminActions = [
    { icon: '👥', title: 'Пользователи', screen: 'admin-users' },
    { icon: '📋', title: 'Заявки', screen: 'admin-applications' },
  ]

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Header title="Панель управления" subtitle="Администратор" />
      <Text style={styles.sectionTitle}>Быстрые действия</Text>
      <View style={styles.actionsGrid}>
        {adminActions.map((action, index) => (
          <TouchableOpacity
            key={index}
            style={styles.actionButton}
            onPress={() =>
              router.push(`/(tabs)/${action.screen}` as RelativePathString)
            }
          >
            <Text style={styles.actionIcon}>{action.icon}</Text>
            <Text style={styles.actionText}>{action.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>
          Добро пожаловать в систему управления
        </Text>
        <Text style={styles.infoText}>
          У вас есть полный доступ к управлению системой умных домов.
          Используйте вкладки ниже для навигации по функциям администратора.
        </Text>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  content: {
    padding: 24,
  },
  infoCard: {
    backgroundColor: '#E8F4FF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#007AFF',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#0066CC',
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
    marginTop: 8,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  actionButton: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    width: '48%',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  actionIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    textAlign: 'center',
  },
})
