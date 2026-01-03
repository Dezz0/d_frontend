import { Tabs } from 'expo-router';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useAuthStore } from '@/store/authStore';

export default function TabLayout() {
  const { user } = useAuthStore();
  const isAdmin = user?.is_admin;

  return (
    <Tabs screenOptions={{ headerShown: false }}>
      {/* Главная страница для всех */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Главная',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          )
        }}
      />

      {/* Профиль для юзера */}
      <Tabs.Screen
        name="user-profile/index"
        options={{
          title: 'Профиль',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
          href: !isAdmin ? undefined : null
        }}
      />

      {/* Табы только для администратора */}
      <Tabs.Screen
        name="admin-applications/index"
        options={{
          title: 'Заявки',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="assignment" size={size} color={color} />
          ),
          href: isAdmin ? undefined : null
        }}
      />
      <Tabs.Screen
        name="admin-users/index"
        options={{
          title: 'Пользователи',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people" size={size} color={color} />
          ),
          href: isAdmin ? undefined : null
        }}
      />

      {/*скрытые табы*/}
      <Tabs.Screen
        name="admin-applications/[id]"
        options={{
          href: null
        }}
      />
      <Tabs.Screen
        name="admin-users/[id]"
        options={{
          href: null
        }}
      />
      <Tabs.Screen
        name="sensor/[type]/[id]"
        options={{
          href: null
        }}
      />
    </Tabs>
  );
}
