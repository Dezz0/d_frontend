import { router, Stack, usePathname } from 'expo-router';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 0,
      gcTime: 0
    },
    mutations: {
      retry: 1
    }
  }
});

export default function RootLayout() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const pathname = usePathname();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (!isReady) return;

    const isAuthPage = pathname.includes('/login') || pathname.includes('/register');

    if (!isAuthenticated && !isAuthPage) {
      router.replace('/login');
    } else if (isAuthenticated && isAuthPage) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, pathname, isReady]);

  return (
    <QueryClientProvider client={queryClient}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </QueryClientProvider>
  );
}
