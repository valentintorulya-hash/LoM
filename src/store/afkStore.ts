import React from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Decimal } from '../lib/decimal';
import { useGameStore } from './gameStore';
import { useEvolutionStore } from './evolutionStore';
import { usePetStore } from './petStore';
import { toast } from './toastStore';

// Base rate (per minute)
const BASE_GOLD_PER_MINUTE = new Decimal(50);

// Max offline time: 12 hours (can be extended)
const MAX_OFFLINE_MINUTES = 12 * 60; // 12 hours in minutes

interface AFKState {
  lastOnlineAt: number;
  maxOfflineMinutes: number;
  
  // Calculated
  calculateAFKRewards: () => { gold: Decimal; lamps: Decimal; minutes: number };
  claimAFKRewards: () => boolean;
  getMaxOfflineMinutes: () => number;
  extendMaxOffline: (minutes: number, diamondCost: Decimal) => boolean;
  updateLastOnline: () => void;
}

export const useAFKStore = create<AFKState>()(
  persist(
    (set, get) => ({
      lastOnlineAt: Date.now(),
      maxOfflineMinutes: MAX_OFFLINE_MINUTES,

      calculateAFKRewards: () => {
        const now = Date.now();
        const offlineMs = now - get().lastOnlineAt;
        const offlineMinutes = Math.min(
          get().maxOfflineMinutes,
          Math.floor(offlineMs / (60 * 1000))
        );

        if (offlineMinutes <= 0) {
          return { gold: new Decimal(0), lamps: new Decimal(0), minutes: 0 };
        }

        // Get multipliers
        const { getEvolutionBonuses } = useEvolutionStore.getState();
        const { getPetBonus } = usePetStore.getState();
        const { lampsPerMinute } = useGameStore.getState();

        const evolutionBonuses = getEvolutionBonuses();
        const goldBonus = getPetBonus('Gold');
        const lampBonus = evolutionBonuses.lamps || 1;

        // Calculate rewards
        // Gold: Base rate * offline time * (1 + gold bonus)
        const gold = BASE_GOLD_PER_MINUTE
          .times(offlineMinutes)
          .times(1 + goldBonus);

        // Lamps: Current lamp rate * offline time * evolution bonus
        const lamps = lampsPerMinute
          .div(60) // Convert per minute to same scale
          .times(offlineMinutes)
          .times(lampBonus);

        return { gold, lamps, minutes: offlineMinutes };
      },

      claimAFKRewards: () => {
        const { gold, lamps, minutes } = get().calculateAFKRewards();
        
        if (minutes <= 0) return false;

        const { addResource } = useGameStore.getState();

        if (gold.gt(0)) addResource('gold', gold);
        if (lamps.gt(0)) addResource('lamps', lamps);

        // Update last online time
        set({ lastOnlineAt: Date.now() });

        // Show toast
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        const timeString = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;

        toast.success(
          'Welcome Back!',
          `While away for ${timeString}: +${gold.toFixed(0)} 💰, +${lamps.toFixed(1)} 💡`,
          5000
        );

        return true;
      },

      getMaxOfflineMinutes: () => {
        return get().maxOfflineMinutes;
      },

      extendMaxOffline: (minutes: number, diamondCost: Decimal) => {
        const { spendResource } = useGameStore.getState();
        
        if (!spendResource('diamonds', diamondCost)) {
          toast.error('Not enough diamonds!', '', 3000);
          return false;
        }

        set((state) => ({
          maxOfflineMinutes: state.maxOfflineMinutes + minutes,
        }));

        toast.success(
          'Offline Time Extended!',
          `Max offline time increased by ${minutes} minutes`,
          3000
        );

        return true;
      },

      updateLastOnline: () => {
        set({ lastOnlineAt: Date.now() });
      },
    }),
    {
      name: 'afk-storage',
      merge: (persistedState: any, currentState) => {
        const state = persistedState as Partial<AFKState>;
        if (!state) return currentState;

        return {
          ...currentState,
          ...state,
        };
      },
    }
  )
);

// Hook to check and claim AFK rewards on app load
export const useAFKRewardsOnLoad = () => {
  const { claimAFKRewards, calculateAFKRewards, updateLastOnline } = useAFKStore();
  
  // Check on mount
  React.useEffect(() => {
    const { minutes } = calculateAFKRewards();
    if (minutes > 5) { // Only show if away for more than 5 minutes
      claimAFKRewards();
    } else {
      updateLastOnline(); // Just update the timestamp
    }
    
    // Update last online when leaving
    const handleBeforeUnload = () => {
      updateLastOnline();
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    // Update periodically while online
    const interval = setInterval(() => {
      updateLastOnline();
    }, 60000); // Every minute
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      clearInterval(interval);
    };
  }, []);
};
