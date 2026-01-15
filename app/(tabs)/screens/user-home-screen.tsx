import React from 'react'
import { ScrollView, StyleSheet } from 'react-native'
import { useAuthStore } from '@/store/authStore'
import { Header } from '../components/header'
import { ApplicationFormScreen } from './application-form-screen'
import { ApplicationStatusScreen } from './application-status-screen'
import { UserMainScreen } from './user-main-screen'

export const UserHomeScreen: React.FC = () => {
  const { user } = useAuthStore()

  const hasPendingApplication = user?.has_pending_application || false
  const applicationSubmitted = user?.application_submitted || false

  let ContentComponent

  if (!hasPendingApplication && !applicationSubmitted) {
    // Состояние 1: Нет pending заявок - показываем форму
    ContentComponent = ApplicationFormScreen
  } else if (hasPendingApplication && !applicationSubmitted) {
    // Состояние 2: Есть pending или rejected заявка, но не подтверждена
    ContentComponent = ApplicationStatusScreen
  } else {
    // Состояние 3: Оба поля true - главная страница
    ContentComponent = UserMainScreen
  }

  if (user === null) return null

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Header title="Умный дом" />
      <ContentComponent />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
  },
})
