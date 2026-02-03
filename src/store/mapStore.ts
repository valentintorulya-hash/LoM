import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface MapArea {
  id: string;
  name: string;
  description: string;
  startStage: number;
  endStage: number;
  environment: string;
}

interface MapState {
  areas: MapArea[];
  activeAreaId: string;
  unlockedAreaIds: string[];
  setActiveArea: (id: string) => void;
  unlockArea: (id: string) => void;
}

const AREAS: MapArea[] = [
  {
    id: 'forest-edge',
    name: 'Forest Edge',
    description: 'Green slimes and soft moss trails.',
    startStage: 1,
    endStage: 25,
    environment: '🌿',
  },
  {
    id: 'mushroom-glen',
    name: 'Mushroom Glen',
    description: 'Spore clouds and hidden caps.',
    startStage: 26,
    endStage: 60,
    environment: '🍄',
  },
  {
    id: 'amber-cavern',
    name: 'Amber Cavern',
    description: 'Crystals, echoes, and deeper foes.',
    startStage: 61,
    endStage: 110,
    environment: '🪨',
  },
];

export const useMapStore = create<MapState>()(
  persist(
    (set, get) => ({
      areas: AREAS,
      activeAreaId: AREAS[0].id,
      unlockedAreaIds: [AREAS[0].id],

      setActiveArea: (id) => {
        if (!get().unlockedAreaIds.includes(id)) return;
        set({ activeAreaId: id });
      },

      unlockArea: (id) => {
        if (get().unlockedAreaIds.includes(id)) return;
        set((state) => ({
          unlockedAreaIds: [...state.unlockedAreaIds, id],
        }));
      },
    }),
    {
      name: 'map-storage',
    }
  )
);
