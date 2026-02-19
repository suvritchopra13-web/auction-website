import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Listing } from '../types';
import type { TickerEvent } from '../data/mockData';
import { MOCK_LISTINGS, MOCK_TICKER_EVENTS } from '../data/mockData';

interface AppStore {
  isDemoMode: boolean;
  setDemoMode: (v: boolean) => void;
  toggleDemoMode: () => void;

  demoListings: Listing[];
  setDemoListings: (listings: Listing[]) => void;
  updateDemoListing: (id: string, patch: Partial<Listing>) => void;

  tickerEvents: TickerEvent[];
  pushTickerEvent: (event: TickerEvent) => void;

  searchQuery: string;
  setSearchQuery: (q: string) => void;

  navScrolled: boolean;
  setNavScrolled: (v: boolean) => void;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      isDemoMode: false,
      setDemoMode: (v) => set({ isDemoMode: v }),
      toggleDemoMode: () =>
        set((s) => ({
          isDemoMode: !s.isDemoMode,
          demoListings: !s.isDemoMode ? MOCK_LISTINGS : [],
        })),

      demoListings: [],
      setDemoListings: (listings) => set({ demoListings: listings }),
      updateDemoListing: (id, patch) =>
        set((s) => ({
          demoListings: s.demoListings.map((l) =>
            l.id === id ? { ...l, ...patch } : l
          ),
        })),

      tickerEvents: MOCK_TICKER_EVENTS,
      pushTickerEvent: (event) =>
        set((s) => ({ tickerEvents: [event, ...s.tickerEvents].slice(0, 20) })),

      searchQuery: '',
      setSearchQuery: (q) => set({ searchQuery: q }),

      navScrolled: false,
      setNavScrolled: (v) => set({ navScrolled: v }),
    }),
    {
      name: 'auction-app-store',
      partialize: (s) => ({ isDemoMode: s.isDemoMode }),
    }
  )
);
