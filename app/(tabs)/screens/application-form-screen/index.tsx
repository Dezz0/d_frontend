import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { FormGroup, PickerInput } from '../../components/form-components';
import { useCreateApplication } from './use-create-application';

export const ApplicationFormScreen: React.FC = () => {
  const {
    isLoading,
    isLoadingDictionaries,
    rooms,
    handleRemoveRoom,
    handleRoomChange,
    roomOptions,
    handleSensorChange,
    sensorOptions,
    handleRemoveSensor,
    handleAddSensor,
    handleAddRoom,
    handleSubmit,
    createApplicationMutation
  } = useCreateApplication();
  
  if (isLoadingDictionaries) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Загрузка словарей...</Text>
      </View>
    );
  }

  return (
    <ScrollView>
      <Text style={styles.formTitle}>Создание умного дома</Text>
      <Text style={styles.formDescription}>
        Выберите комнаты и датчики для вашего умного дома
      </Text>

      {rooms.map((room, roomIndex) => (
        <View key={room.id} style={styles.roomContainer}>
          <View style={styles.roomHeader}>
            <Text style={styles.roomTitle}>Комната #{roomIndex + 1}</Text>
            {rooms.length > 1 && (
              <TouchableOpacity
                style={styles.removeRoomButton}
                onPress={() => handleRemoveRoom(roomIndex)}
              >
                <Text style={styles.removeRoomButtonText}>×</Text>
              </TouchableOpacity>
            )}
          </View>

          <FormGroup label="Комната:">
            <PickerInput
              value={room.selectedRoomId?.toString() || ''}
              onValueChange={(value) => handleRoomChange(roomIndex, parseInt(value))}
              items={roomOptions}
              placeholder="Выберите комнату"
              disabled={isLoading}
            />
          </FormGroup>

          <View style={styles.sensorsContainer}>
            <Text style={styles.sensorsTitle}>Датчики:</Text>

            {room.sensorIds.map((sensorId, sensorIndex) => (
              <View key={sensorIndex} style={styles.sensorRow}>
                <View style={styles.sensorInputContainer}>
                  <PickerInput
                    value={sensorId === -1 ? '' : sensorId.toString()}
                    onValueChange={(value) => handleSensorChange(roomIndex, sensorIndex, parseInt(value))}
                    items={sensorOptions}
                    placeholder="Выберите датчик"
                    disabled={isLoading || !room.selectedRoomId}
                  />
                </View>

                <TouchableOpacity
                  style={styles.removeSensorButton}
                  onPress={() => handleRemoveSensor(roomIndex, sensorIndex)}
                  disabled={isLoading}
                >
                  <Text style={styles.removeSensorButtonText}>Удалить</Text>
                </TouchableOpacity>
              </View>
            ))}

            <TouchableOpacity
              style={[
                styles.addSensorButton,
                (!room.selectedRoomId || isLoading) && styles.buttonDisabled
              ]}
              onPress={() => handleAddSensor(roomIndex)}
              disabled={!room.selectedRoomId || isLoading}
            >
              <Text style={styles.addSensorButtonText}>+ Добавить датчик</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}

      <TouchableOpacity
        style={[styles.addRoomButton, isLoading && styles.buttonDisabled]}
        onPress={handleAddRoom}
        disabled={isLoading}
      >
        <Text style={styles.addRoomButtonText}>+ Добавить комнату</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.submitButton,
          isLoading && styles.buttonDisabled
        ]}
        onPress={handleSubmit}
        disabled={isLoading}
      >
        <Text style={styles.submitButtonText}>
          {createApplicationMutation.isPending ? 'Отправка...' : 'Отправить заявку'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  formTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8
  },
  formDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 20
  },
  roomContainer: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E5E5'
  },
  roomHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  roomTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151'
  },
  removeRoomButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center'
  },
  removeRoomButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    lineHeight: 20
  },
  sensorsContainer: {
    marginTop: 12
  },
  sensorsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8
  },
  sensorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  sensorInputContainer: {
    flex: 1,
    marginRight: 8
  },
  removeSensorButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#D1D5DB'
  },
  removeSensorButtonText: {
    color: '#6B7280',
    fontSize: 14
  },
  addSensorButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#F3F4F6',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    marginTop: 4
  },
  addSensorButtonText: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '500'
  },
  addRoomButton: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: '#EFF6FF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#60A5FA',
    alignItems: 'center',
    marginBottom: 20
  },
  addRoomButtonText: {
    color: '#2563EB',
    fontSize: 16,
    fontWeight: '600'
  },
  submitButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600'
  },
  buttonDisabled: {
    opacity: 0.6
  }
});
