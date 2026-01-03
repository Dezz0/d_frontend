import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import type {
  UserProfileResponseFirstName,
  UserProfileResponseLastName,
  UserProfileResponseMiddleName
} from '@/shared/api/generated/model';

interface EditProfileModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: {
    first_name?: string;
    last_name?: string;
    middle_name?: string;
  }) => void;
  initialData?: {
    first_name?: UserProfileResponseFirstName;
    last_name?: UserProfileResponseLastName;
    middle_name?: UserProfileResponseMiddleName;
  };
  isLoading?: boolean;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
                                                                    visible,
                                                                    onClose,
                                                                    onSubmit,
                                                                    initialData,
                                                                    isLoading = false
                                                                  }) => {
  const [formData, setFormData] = useState({
    first_name: initialData?.first_name || '',
    last_name: initialData?.last_name || '',
    middle_name: initialData?.middle_name || ''
  });

  const handleSubmit = () => {
    if (!formData.first_name && !formData.last_name && !formData.middle_name) {
      Alert.alert('Внимание', 'Заполните хотя бы одно поле');
      return;
    }

    onSubmit({
      first_name: formData.first_name || undefined,
      last_name: formData.last_name || undefined,
      middle_name: formData.middle_name || undefined
    });

    onClose();
  };

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
              <Text style={styles.modalTitle}>Редактировать профиль</Text>
            </View>

            <ScrollView style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Фамилия</Text>
                <TextInput
                  style={styles.input}
                  value={formData.last_name}
                  onChangeText={(text) => setFormData({ ...formData, last_name: text })}
                  placeholder="Введите фамилию"
                  editable={!isLoading}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Имя</Text>
                <TextInput
                  style={styles.input}
                  value={formData.first_name}
                  onChangeText={(text) => setFormData({ ...formData, first_name: text })}
                  placeholder="Введите имя"
                  editable={!isLoading}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Отчество</Text>
                <TextInput
                  style={styles.input}
                  value={formData.middle_name}
                  onChangeText={(text) => setFormData({ ...formData, middle_name: text })}
                  placeholder="Введите отчество (необязательно)"
                  editable={!isLoading}
                />
              </View>
            </ScrollView>

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
                  {isLoading ? 'Сохранение...' : 'Сохранить'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end'
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%'
  },
  modalHeader: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB'
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center'
  },
  form: {
    padding: 20
  },
  inputGroup: {
    marginBottom: 16
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 6
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: 'white'
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    gap: 12
  },
  button: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center'
  },
  cancelButton: {
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#D1D5DB'
  },
  submitButton: {
    backgroundColor: '#007AFF'
  },
  cancelButtonText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '600'
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600'
  }
});
