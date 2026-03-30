import { create } from 'zustand';

export const useSubscriptionStore = create((set) => ({
  filters: {
    status: 'all',
    category: 'all',
    sort: 'nextRenewalDate',
    order: 'asc'
  },
  setFilters: (filters) => set((state) => ({ 
    filters: { ...state.filters, ...filters } 
  })),
}));
