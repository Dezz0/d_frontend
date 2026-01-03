import React from 'react';
import { Platform, StyleSheet, Text, TextInput, View } from 'react-native';
import { Picker } from '@react-native-picker/picker';

interface FormGroupProps {
  label: string;
  children: React.ReactNode;
}

export const FormGroup: React.FC<FormGroupProps> = ({ label, children }) => (
  <View style={styles.formGroup}>
    <Text style={styles.label}>{label}</Text>
    {children}
  </View>
);

interface PickerInputProps {
  value: string;
  onValueChange: (value: string) => void;
  items: Array<{
    label: string;
    value: string | number
  }>;
  disabled?: boolean;
  placeholder?: string;
}

export const PickerInput: React.FC<PickerInputProps> = ({
                                                          value,
                                                          onValueChange,
                                                          items,
                                                          disabled = false,
                                                          placeholder = 'Выберите...'
                                                        }) => (
  <View style={[styles.pickerContainer, disabled && styles.disabled]}>
    <Picker
      selectedValue={value}
      onValueChange={onValueChange}
      style={styles.picker}
      enabled={!disabled}
    >
      {placeholder && (
        <Picker.Item
          label={disabled ? placeholder : placeholder}
          value=""
        />
      )}
      {items.map((item) => (
        <Picker.Item
          key={item.value}
          label={item.label}
          value={item.value}
        />
      ))}
    </Picker>
  </View>
);

interface TextInputFieldProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  keyboardType?: 'default' | 'numeric' | 'email-address';
  multiline?: boolean;
  numberOfLines?: number;
}

export const TextInputField: React.FC<TextInputFieldProps> = ({
                                                                value,
                                                                onChangeText,
                                                                placeholder,
                                                                keyboardType = 'default',
                                                                multiline = false,
                                                                numberOfLines = 1
                                                              }) => (
  <TextInput
    style={[
      styles.input,
      multiline && styles.textArea,
      { height: multiline ? numberOfLines * 24 : 44 }
    ]}
    value={value}
    onChangeText={onChangeText}
    placeholder={placeholder}
    keyboardType={keyboardType}
    multiline={multiline}
    numberOfLines={numberOfLines}
    textAlignVertical={multiline ? 'top' : 'center'}
  />
);

const styles = StyleSheet.create({
  formGroup: {
    marginBottom: 16
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    overflow: 'hidden'
  },
  picker: {
    height: Platform.OS === 'ios' ? 150 : 50
  },
  disabled: {
    opacity: 0.5,
    backgroundColor: '#F5F5F5'
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    backgroundColor: 'white'
  },
  textArea: {
    textAlignVertical: 'top',
    paddingTop: 10,
    paddingBottom: 10
  }
});
