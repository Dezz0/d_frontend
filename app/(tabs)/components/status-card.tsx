import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface StatusCardProps {
  icon: string;
  title: string;
  message: string;
  status?: 'pending' | 'approved' | 'rejected';
  note?: string;
}

export const StatusCard: React.FC<StatusCardProps> = ({
                                                        icon,
                                                        title,
                                                        message,
                                                        status = 'pending',
                                                        note
                                                      }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'pending':
        return '#FA8C16';
      case 'approved':
        return '#52C41A';
      case 'rejected':
        return '#FF4D4F';
      default:
        return '#666';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'pending':
        return 'В обработке';
      case 'approved':
        return 'Одобрена';
      case 'rejected':
        return 'Отклонена';
      default:
        return '';
    }
  };

  return (
    <View style={[
      styles.card,
      {
        backgroundColor: status === 'pending' ? '#FFF9E6' : '#F6FFED',
        borderColor: status === 'pending' ? '#FFE58F' : '#B7EB8F'
      }
    ]}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      {note && (
        <Text style={styles.note}>
          {note}
          <Text style={[styles.statusText, { color: getStatusColor() }]}>
            {getStatusText()}
          </Text>
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 30,
    alignItems: 'center',
    borderWidth: 1
  },
  icon: {
    fontSize: 48,
    marginBottom: 16
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#D48806',
    marginBottom: 12,
    textAlign: 'center'
  },
  message: {
    fontSize: 14,
    color: '#D48806',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16
  },
  note: {
    fontSize: 14,
    color: '#666'
  },
  statusText: {
    fontWeight: '600'
  }
});
