import { create } from 'zustand';
import { Exchange, CloudProvider, AppState } from '../types';

interface Store extends AppState {
  setSelectedExchange: (exchange: Exchange | null) => void;
  setSelectedCloudProvider: (provider: CloudProvider | 'all') => void;
  setSearchTerm: (term: string) => void;
  toggleRealtime: () => void;
  toggleHistorical: () => void;
  toggleRegions: () => void;
  toggleDarkMode: () => void;
  setTimeRange: (range: '1h' | '24h' | '7d' | '30d') => void;
  setLatencyRange: (range: [number, number]) => void;
}

export const useStore = create<Store>((set) => ({
  selectedExchange: null,
  selectedCloudProvider: 'all',
  searchTerm: '',
  showRealtime: true,
  showHistorical: true,
  showRegions: true,
  darkMode: true,
  timeRange: '24h',
  latencyRange: [0, 200],
  
  setSelectedExchange: (exchange) => set({ selectedExchange: exchange }),
  setSelectedCloudProvider: (provider) => set({ selectedCloudProvider: provider }),
  setSearchTerm: (term) => set({ searchTerm: term }),
  toggleRealtime: () => set((state) => ({ showRealtime: !state.showRealtime })),
  toggleHistorical: () => set((state) => ({ showHistorical: !state.showHistorical })),
  toggleRegions: () => set((state) => ({ showRegions: !state.showRegions })),
  toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
  setTimeRange: (range) => set({ timeRange: range }),
  setLatencyRange: (range) => set({ latencyRange: range }),
}));