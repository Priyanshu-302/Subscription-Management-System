import api from './axios';

export const authAPI = {
  register: (data) => api.post('/api/auth/register', data),
  login: (data) => api.post('/api/auth/login', data),
  verifyOtp: (data) => api.post('/api/auth/verify-login-otp', data),
  forgotPassword: (data) => api.post('/api/auth/forgot-password', data),
  verifyForgotOtp: (data) => api.post('/api/auth/verify-forgot-otp', data),
  resetPassword: (data) => api.post('/api/auth/reset-password', data),
  getProfile: () => api.get('/api/auth/profile'),
  updateProfile: (data) => api.patch('/api/auth/profile', data),
};
