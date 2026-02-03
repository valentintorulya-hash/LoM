import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Decimal } from '../lib/decimal';
import { useGameStore } from './gameStore';
import { toast } from './toastStore';

export const EVOLUTION_STAGES = [
  {
    id: 'spore',
    name: 'Spore',
    description: 'Just a tiny spore waiting to grow.',
    reqLevel: 1,
    reqStage: 1,
    bonuses: {},
    cost: {},
    icon: '🌱',
    color: '#8B4513',
  },
  {
    id: 'baby_shroom',
    name: 'Baby Shroom',
    description: 'A cute little mushroom with big dreams.',
    reqLevel: 10,
    reqStage: 20,
    bonuses: { attack: 1.2, hp: 1.1 },
    cost: { gold: new Decimal(1000) },
    icon: '🍄',
    color: '#FF6B6B',
  },
  {
    id: 'youth_shroom',
    name: 'Youth Shroom',
    description: 'Growing stronger every day!',
    reqLevel: 30,
    reqStage: 60,
    bonuses: { attack: 1.5, hp: 1.3, defense: 1.2 },
    cost: { gold: new Decimal(5000), diamonds: new Decimal(10) },
    icon: '🧙‍♂️',
    color: '#4ECDC4',
  },
  {
    id: 'adult_shroom',
    name: 'Adult Shroom',
    description: 'A mighty mushroom warrior.',
    reqLevel: 60,
    reqStage: 120,
    bonuses: { attack: 2.0, hp: 1.8, defense: 1.5, speed: 1.2 },
    cost: { gold: new Decimal(20000), diamonds: new Decimal(50) },
    icon: '👑',
    color: '#FFD93D',
  },
  {
    id: 'mushroom_king',
    name: 'Mushroom King',
    description: 'The ruler of all fungi!',
    reqLevel: 100,
    reqStage: 200,
    bonuses: { attack: 3.0, hp: 2.5, defense: 2.0, speed: 1.5, lamps: 2.0 },
    cost: { gold: new Decimal(100000), diamonds: new Decimal(200) },
    icon: '🤴',
    color: '#9B59B6',
  },
  {
    id: 'mushroom_god',
    name: 'Mushroom God',
    description: 'Transcended beyond mortal limits.',
    reqLevel: 150,
    reqStage: 300,
    bonuses: { attack: 5.0, hp: 4.0, defense: 3.0, speed: 2.0, lamps: 3.0 },
    cost: { gold: new Decimal(500000), diamonds: new Decimal(500) },
    icon: '👑',
    color: '#E74C3C',
  },
] as const;

export type EvolutionStageId = typeof EVOLUTION_STAGES[number]['id'];

interface EvolutionState {
  currentStageId: EvolutionStageId;
  evolutionHistory: EvolutionStageId[];
  
  // Computed
  getCurrentStage: () => typeof EVOLUTION_STAGES[number];
  getNextStage: () => typeof EVOLUTION_STAGES[number] | null;
  canEvolve: () => boolean;
  evolve: () => boolean;
  getEvolutionBonuses: () => Record<string, number>;
  isMaxEvolution: () => boolean;
}

export const useEvolutionStore = create<EvolutionState>()(
  persist(
    (set, get) => ({
      currentStageId: 'spore',
      evolutionHistory: ['spore'],

      getCurrentStage: () => {
        return EVOLUTION_STAGES.find(s => s.id === get().currentStageId) || EVOLUTION_STAGES[0];
      },

      getNextStage: () => {
        const currentIndex = EVOLUTION_STAGES.findIndex(s => s.id === get().currentStageId);
        return EVOLUTION_STAGES[currentIndex + 1] || null;
      },

      canEvolve: () => {
        const nextStage = get().getNextStage();
        if (!nextStage) return false;

        const { playerLevel } = useGameStore.getState();
        // Need to get combat stage from combat store, not game store
        const combatStore = JSON.parse(localStorage.getItem('combat-storage') || '{}');
        const currentCombatStage = combatStore.state?.stage || 1;
        
        // Check level requirement
        if (playerLevel < nextStage.reqLevel) return false;
        
        // Check stage requirement
        if (currentCombatStage < nextStage.reqStage) return false;

        // Check cost
        const { currencies } = useGameStore.getState();
        const cost = nextStage.cost as { gold?: Decimal; diamonds?: Decimal };
        if (cost.gold && currencies.gold.lt(cost.gold)) return false;
        if (cost.diamonds && currencies.diamonds.lt(cost.diamonds)) return false;

        return true;
      },

      evolve: () => {
        const nextStage = get().getNextStage();
        if (!nextStage || !get().canEvolve()) return false;

        const { spendResource } = useGameStore.getState();
        const cost = nextStage.cost as { gold?: Decimal; diamonds?: Decimal };

        // Spend resources
        if (cost.gold) {
          const success = spendResource('gold', cost.gold);
          if (!success) return false;
        }
        if (cost.diamonds) {
          const success = spendResource('diamonds', cost.diamonds);
          if (!success) return false;
        }

        // Apply evolution
        set((state) => ({
          currentStageId: nextStage.id,
          evolutionHistory: [...state.evolutionHistory, nextStage.id],
        }));

        // Show celebration toast
        toast.success(
          '🍄 EVOLUTION! 🍄',
          `You evolved into ${nextStage.name}!`,
          5000
        );

        return true;
      },

      getEvolutionBonuses: () => {
        const currentStage = get().getCurrentStage();
        return currentStage.bonuses;
      },

      isMaxEvolution: () => {
        return get().currentStageId === EVOLUTION_STAGES[EVOLUTION_STAGES.length - 1].id;
      },
    }),
    {
      name: 'evolution-storage',
    }
  )
);

// Hook to get evolution multiplier for a specific stat
export const useEvolutionMultiplier = (stat: keyof typeof EVOLUTION_STAGES[0]['bonuses']): number => {
  const bonuses = useEvolutionStore.getState().getEvolutionBonuses();
  return bonuses[stat] || 1;
};
