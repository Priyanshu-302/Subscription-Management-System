import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AppRouter } from './router';
import { useEffect } from 'react';
import { useAuthStore } from './store/auth.store';
import { authAPI } from './api/auth.api';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  const { token, setAuth, logout } = useAuthStore();

  useEffect(() => {
    if (token) {
      authAPI.getProfile().then(res => {
        setAuth(res.data.data, token);
      }).catch((err) => {
        logout();
      });
    }
  }, [token, setAuth, logout]);

  return (
    <QueryClientProvider client={queryClient}>
      <AppRouter />
      <Toaster 
        position="top-right" 
        toastOptions={{
          style: {
            background: '#1f2937',
            color: '#fff',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }
        }}
      />
    </QueryClientProvider>
  );
}

export default App;
