import axios from 'axios';
import { useAuthStore } from '../store/auth.store';

const api = axios.create({
  baseURL: 'https://subscription-management-system-mao2.onrender.com',
});

api.interceptors.request.use(
  (config) => {
    const { token, sessionToken, resetToken } = useAuthStore.getState();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (sessionToken) {
      config.headers['x-session-token'] = sessionToken;
    }
    if (resetToken) {
      config.headers['x-reset-token'] = resetToken;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
