import React from 'react'
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { useAuth } from './hooks/useAuth'
import { router } from 'expo-router'

export default function LoginScreen() {
  const { email, setEmail, password, setPassword, handleLogin, isLoading } =
    useAuth()

  const handleGoToRegister = () => {
    router.push('/register')
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Вход в систему</Text>

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
              placeholder="Введите ваш пароль"
              secureTextEntry
              editable={!isLoading}
              style={[styles.input, isLoading && styles.inputDisabled]}
              placeholderTextColor="#999"
            />
          </View>

          <TouchableOpacity
            onPress={handleLogin}
            disabled={isLoading}
            style={[styles.button, isLoading && styles.buttonDisabled]}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.buttonText}>Войти</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleGoToRegister}
            disabled={isLoading}
            style={styles.registerLink}
          >
            <Text style={styles.registerLinkText}>
              Нет аккаунта?{' '}
              <Text style={styles.registerLinkBold}>Зарегистрироваться</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 24,
  },
  content: {
    width: '100%',
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
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  registerLink: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  registerLinkText: {
    fontSize: 16,
    color: '#6B7280',
  },
  registerLinkBold: {
    fontWeight: '600',
    color: '#007AFF',
  },
})
