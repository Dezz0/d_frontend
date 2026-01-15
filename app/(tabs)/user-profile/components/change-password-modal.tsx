import React, { useState } from 'react'
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'

interface ChangePasswordModalProps {
  visible: boolean
  onClose: () => void
  onSubmit: (oldPassword: string, newPassword: string) => void
  isLoading?: boolean
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  visible,
  onClose,
  onSubmit,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const handleSubmit = () => {
    // Валидация
    if (
      !formData.oldPassword ||
      !formData.newPassword ||
      !formData.confirmPassword
    ) {
      Alert.alert('Внимание', 'Заполните все поля')
      return
    }

    if (formData.newPassword.length < 6) {
      Alert.alert(
        'Внимание',
        'Новый пароль должен содержать минимум 6 символов',
      )
      return
    }

    if (formData.newPassword !== formData.confirmPassword) {
      Alert.alert('Внимание', 'Новые пароли не совпадают')
      return
    }

    if (formData.oldPassword === formData.newPassword) {
      Alert.alert('Внимание', 'Новый пароль должен отличаться от старого')
      return
    }

    onSubmit(formData.oldPassword, formData.newPassword)

    // Сброс формы
    setFormData({
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    })
    onClose()
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalContainer}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Смена пароля</Text>
            </View>

            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Старый пароль</Text>
                <TextInput
                  style={styles.input}
                  value={formData.oldPassword}
                  onChangeText={text =>
                    setFormData({ ...formData, oldPassword: text })
                  }
                  placeholder="Введите старый пароль"
                  secureTextEntry
                  editable={!isLoading}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Новый пароль</Text>
                <TextInput
                  style={styles.input}
                  value={formData.newPassword}
                  onChangeText={text =>
                    setFormData({ ...formData, newPassword: text })
                  }
                  placeholder="Введите новый пароль"
                  secureTextEntry
                  editable={!isLoading}
                />
                <Text style={styles.hint}>Минимум 6 символов</Text>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Подтвердите новый пароль</Text>
                <TextInput
                  style={styles.input}
                  value={formData.confirmPassword}
                  onChangeText={text =>
                    setFormData({ ...formData, confirmPassword: text })
                  }
                  placeholder="Повторите новый пароль"
                  secureTextEntry
                  editable={!isLoading}
                />
              </View>
            </View>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={onClose}
                disabled={isLoading}
              >
                <Text style={styles.cancelButtonText}>Отмена</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.submitButton]}
                onPress={handleSubmit}
                disabled={isLoading}
              >
                <Text style={styles.submitButtonText}>
                  {isLoading ? 'Сохранение...' : 'Сменить пароль'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalHeader: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
  },
  form: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: 'white',
  },
  hint: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
    fontStyle: 'italic',
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    gap: 12,
  },
  button: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  submitButton: {
    backgroundColor: '#007AFF',
  },
  cancelButtonText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '600',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
})
