import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type TabType = 'HERO' | 'CAMP' | 'LAMP' | 'BATTLE' | 'SHOP';
export type OverlayType = 'DAILY' | 'MAIL' | 'ARENA' | 'EVENT' | 'NEWS' | null;

interface UIState {
  activeTab: TabType;
  overlay: OverlayType;
  setActiveTab: (tab: TabType) => void;
  setOverlay: (overlay: OverlayType) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      activeTab: 'LAMP', // Default to LAMP as main tab
      overlay: null,
      setActiveTab: (tab) => set({ activeTab: tab }),
      setOverlay: (overlay) => set({ overlay }),
    }),
    {
      name: 'ui-storage',
    }
  )
);
