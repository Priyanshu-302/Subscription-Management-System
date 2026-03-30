import api from './axios';

export const subscriptionAPI = {
  getAll: (params) => api.get('/api/subscriptions', { params }),
  getSummary: () => api.get('/api/subscriptions/summary'),
  getById: (id) => api.get(`/api/subscriptions/${id}`),
  create: (data) => api.post('/api/subscriptions/create', data),
  update: (id, data) => api.patch(`/api/subscriptions/${id}`, data),
  delete: (id) => api.delete(`/api/subscriptions/${id}`),
};
