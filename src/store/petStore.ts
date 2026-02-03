import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Pet } from '../lib/gameTypes';
import { Decimal } from '../lib/decimal';
import { useGameStore } from './gameStore';

export const PETS_DATA: Pet[] = [
  {
    id: 'snail',
    name: 'Swift Snail',
    description: '+10% Gold from monsters',
    level: 1,
    bonusType: 'Gold',
    bonusValue: 0.1,
    icon: '🐌',
    unlockCost: new Decimal(100),
  },
  {
    id: 'firefly',
    name: 'Lamp Fly',
    description: '+2 Lamps per minute',
    level: 1,
    bonusType: 'Lamps',
    bonusValue: 2,
    icon: '🪰',
    unlockCost: new Decimal(500),
  },
  {
    id: 'dragon',
    name: 'Baby Dragon',
    description: '+15% Attack Power',
    level: 1,
    bonusType: 'Attack',
    bonusValue: 0.15,
    icon: '🐲',
    unlockCost: new Decimal(2000),
  },
];

interface PetState {
  unlockedIds: string[];
  petLevels: Record<string, number>;
  
  unlockPet: (id: string) => boolean;
  levelUpPet: (id: string) => void;
  getPetBonus: (type: Pet['bonusType']) => number;
}

export const usePetStore = create<PetState>()(
  persist(
    (set, get) => ({
      unlockedIds: [],
      petLevels: {},

      unlockPet: (id) => {
        const pet = PETS_DATA.find(p => p.id === id);
        if (!pet || get().unlockedIds.includes(id)) return false;

        const { spendResource } = useGameStore.getState();
        const success = spendResource('gold', pet.unlockCost);

        if (success) {
          set((state) => ({
            unlockedIds: [...state.unlockedIds, id],
            petLevels: { ...state.petLevels, [id]: 1 }
          }));
          return true;
        }
        return false;
      },

      levelUpPet: (id) => {
        // Logic for leveling up pets (e.g. increase cost each level)
        set((state) => ({
          petLevels: { ...state.petLevels, [id]: (state.petLevels[id] || 1) + 1 }
        }));
      },

      getPetBonus: (type) => {
        const { unlockedIds, petLevels } = get();
        let total = 0;
        
        unlockedIds.forEach(id => {
          const pet = PETS_DATA.find(p => p.id === id);
          if (pet && pet.bonusType === type) {
            const level = petLevels[id] || 1;
            // Linear scaling for simplicity: base * level
            total += pet.bonusValue * level;
          }
        });

        return total;
      },
    }),
    {
      name: 'pet-storage',
    }
  )
);
