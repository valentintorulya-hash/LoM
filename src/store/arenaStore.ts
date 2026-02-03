import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Decimal } from '../lib/decimal';
import { useGameStore } from './gameStore';

export interface ArenaOpponent {
  id: string;
  name: string;
  power: number;
  rank: number;
  rewardGold: Decimal;
  rewardDiamonds: Decimal;
}

interface ArenaState {
  rank: number;
  points: number;
  dailyRewardClaimed: boolean;
  opponents: ArenaOpponent[];
  refreshOpponents: () => void;
  fightOpponent: (id: string) => void;
  claimDailyReward: () => void;
}

const NAMES = ['Moss Knight', 'Spore Mage', 'Cave Slime', 'Forest Warden', 'Ember Beetle', 'Stone Toad'];

const generateOpponents = (currentRank: number): ArenaOpponent[] => {
  return Array.from({ length: 3 }).map((_, index) => {
    const rank = Math.max(1, currentRank - (index * 7 + 3));
    const power = 350 + index * 120 + Math.floor(Math.random() * 140);
    const rewardGold = new Decimal(200 + index * 120);
    const rewardDiamonds = new Decimal(index === 0 ? 1 : 0);

    return {
      id: `arena-${Date.now()}-${index}`,
      name: NAMES[(currentRank + index) % NAMES.length],
      power,
      rank,
      rewardGold,
      rewardDiamonds,
    };
  });
};

export const useArenaStore = create<ArenaState>()(
  persist(
    (set, get) => ({
      rank: 5200,
      points: 0,
      dailyRewardClaimed: false,
      opponents: generateOpponents(5200),

      refreshOpponents: () => {
        const { rank } = get();
        set({ opponents: generateOpponents(rank) });
      },

      fightOpponent: (id) => {
        const opponent = get().opponents.find((item) => item.id === id);
        if (!opponent) return;

        const { addResource } = useGameStore.getState();
        addResource('gold', opponent.rewardGold);
        if (opponent.rewardDiamonds.gt(0)) addResource('diamonds', opponent.rewardDiamonds);

        const nextPoints = get().points + 10;
        const nextRank = Math.max(1, get().rank - 2);

        set({
          points: nextPoints,
          rank: nextRank,
          opponents: generateOpponents(nextRank),
        });
      },

      claimDailyReward: () => {
        if (get().dailyRewardClaimed) return;
        const { addResource } = useGameStore.getState();
        addResource('gold', new Decimal(500));
        addResource('diamonds', new Decimal(2));
        set({ dailyRewardClaimed: true });
      },
    }),
    {
      name: 'arena-storage',
    }
  )
);
