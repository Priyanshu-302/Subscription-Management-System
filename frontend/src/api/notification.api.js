import api from './axios';

export const notificationAPI = {
  getAll: () => api.get('/api/notifications'),
  getById: (id) => api.get(`/api/notifications/${id}`),
  markAsRead: (id) => api.patch(`/api/notifications/${id}/read`),
  markAllRead: () => api.patch('/api/notifications/mark-all-read'),
  delete: (id) => api.delete(`/api/notifications/${id}`),
};
