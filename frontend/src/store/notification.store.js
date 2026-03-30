import { create } from 'zustand';

export const useNotificationStore = create((set) => ({
  notifications: [],
  unreadCount: 0,
  setNotifications: (notifications) => set({ 
    notifications, 
    unreadCount: notifications.filter(n => !n.isRead).length 
  }),
  markAsRead: (id) => set((state) => {
    const newNotifs = state.notifications.map(n => n.id === id ? { ...n, isRead: true } : n);
    return {
      notifications: newNotifs,
      unreadCount: newNotifs.filter(n => !n.isRead).length
    };
  }),
  markAllAsRead: () => set((state) => ({
    notifications: state.notifications.map(n => ({ ...n, isRead: true })),
    unreadCount: 0
  })),
}));
