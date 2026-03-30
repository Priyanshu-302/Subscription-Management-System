import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      sessionToken: null,
      resetToken: null,

      setAuth: (user, token) => set({ user, token }),
      setSessionToken: (sessionToken) => set({ sessionToken }),
      setResetToken: (resetToken) => set({ resetToken }),
      logout: () => set({ user: null, token: null, sessionToken: null, resetToken: null }),
    }),
    {
      name: 'auth-storage',
      // only persist token and user, not sessionToken and resetToken
      partialize: (state) => ({ token: state.token, user: state.user }),
    }
  )
);
