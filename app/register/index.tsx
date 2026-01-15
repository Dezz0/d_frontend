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
import { useRegister } from './hooks/useRegister'
import { router } from 'expo-router'

export default function RegisterScreen() {
  const {
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    handleRegister,
    isLoading,
  } = useRegister()

  const handleGoToLogin = () => {
    router.replace('/login')
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.content}>
        <Text style={styles.title}>Регистрация</Text>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Логин</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Введите ваш логин"
              autoCapitalize="none"
              editable={!isLoading}
              style={[styles.input, isLoading && styles.inputDisabled]}
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Пароль</Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Введите пароль"
              secureTextEntry
              editable={!isLoading}
              style={[styles.input, isLoading && styles.inputDisabled]}
              placeholderTextColor="#999"
            />
            <Text style={styles.hint}>Минимум 6 символов</Text>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Подтвердите пароль</Text>
            <TextInput
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Повторите пароль"
              secureTextEntry
              editable={!isLoading}
              style={[styles.input, isLoading && styles.inputDisabled]}
              placeholderTextColor="#999"
            />
          </View>

          <TouchableOpacity
            onPress={handleRegister}
            disabled={isLoading}
            style={[styles.registerButton, isLoading && styles.buttonDisabled]}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.buttonText}>Зарегистрироваться</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleGoToLogin}
            disabled={isLoading}
            style={styles.loginLink}
          >
            <Text style={styles.loginLinkText}>
              Уже есть аккаунт? <Text style={styles.loginLinkBold}>Войти</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  content: {
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#007AFF',
    marginBottom: 32,
  },
  form: {
    gap: 20,
  },
  inputContainer: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  hint: {
    fontSize: 12,
    color: '#6B7280',
    fontStyle: 'italic',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: 'white',
  },
  inputDisabled: {
    opacity: 0.6,
    backgroundColor: '#F5F5F5',
  },
  registerButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  loginLink: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  loginLinkText: {
    fontSize: 16,
    color: '#6B7280',
  },
  loginLinkBold: {
    fontWeight: '600',
    color: '#007AFF',
  },
})
