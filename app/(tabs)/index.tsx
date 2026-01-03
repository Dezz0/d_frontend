import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuthStore } from '@/store/authStore';
import { AdminHomeScreen } from './screens/admin-home-screen';
import { UserHomeScreen } from './screens/user-home-screen';

export default function HomeScreen() {
  const { user } = useAuthStore();
  const insets = useSafeAreaInsets();
  const isAdmin = user?.is_admin;

  return (
    <View style={[
      styles.container,
      {
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right
      }
    ]}>
      {isAdmin ? <AdminHomeScreen /> : <UserHomeScreen />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  }
});
