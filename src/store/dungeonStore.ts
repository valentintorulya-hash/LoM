import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Decimal } from '../lib/decimal';
import { useGameStore } from './gameStore';
import { useEvolutionStore } from './evolutionStore';
import { toast } from './toastStore';

export const DUNGEONS = [
  {
    id: 'boss_rush',
    name: 'Boss Rush',
    description: 'Face powerful bosses for epic rewards!',
    icon: '👹',
    color: '#E74C3C',
    cooldown: 24 * 60 * 60 * 1000, // 24 hours
    reqLevel: 10,
    reqStage: 20,
    waves: 5,
    rewards: {
      gold: new Decimal(5000),
      diamonds: new Decimal(10),
      lamps: new Decimal(20),
    },
  },
  {
    id: 'gold_mine',
    name: 'Gold Mine',
    description: 'Mine for massive amounts of gold!',
    icon: '💰',
    color: '#F39C12',
    cooldown: 4 * 60 * 60 * 1000, // 4 hours
    reqLevel: 5,
    reqStage: 10,
    waves: 3,
    rewards: {
      gold: new Decimal(10000),
      diamonds: new Decimal(0),
      lamps: new Decimal(0),
    },
  },
  {
    id: 'lamp_sanctuary',
    name: 'Lamp Sanctuary',
    description: 'Ancient lamps await in this mystical place.',
    icon: '💡',
    color: '#3498DB',
    cooldown: 8 * 60 * 60 * 1000, // 8 hours
    reqLevel: 15,
    reqStage: 30,
    waves: 4,
    rewards: {
      gold: new Decimal(1000),
      diamonds: new Decimal(5),
      lamps: new Decimal(50),
    },
  },
  {
    id: 'endless_tower',
    name: 'Endless Tower',
    description: 'How high can you climb?',
    icon: '🏰',
    color: '#9B59B6',
    cooldown: 0, // No cooldown
    reqLevel: 20,
    reqStage: 40,
    waves: Infinity,
    rewards: {
      gold: new Decimal(2000),
      diamonds: new Decimal(2),
      lamps: new Decimal(10),
    },
  },
] as const;

export type DungeonId = typeof DUNGEONS[number]['id'];

export interface DungeonAttempt {
  dungeonId: DungeonId;
  currentWave: number;
  maxWaveReached: number;
  isActive: boolean;
  startedAt: number;
}

interface DungeonState {
  cooldowns: Partial<Record<DungeonId, number>>; // timestamp when ready
  attempts: Partial<Record<DungeonId, DungeonAttempt>>;
  towerHighestFloor: number;
  
  // Actions
  canEnter: (dungeonId: DungeonId) => boolean;
  getCooldownRemaining: (dungeonId: DungeonId) => number;
  getCooldownPercent: (dungeonId: DungeonId) => number;
  enterDungeon: (dungeonId: DungeonId) => boolean;
  completeWave: (dungeonId: DungeonId, wave: number) => void;
  failDungeon: (dungeonId: DungeonId) => void;
  claimRewards: (dungeonId: DungeonId) => void;
  skipCooldown: (dungeonId: DungeonId) => boolean;
  getAttempt: (dungeonId: DungeonId) => DungeonAttempt | null;
  isDungeonActive: (dungeonId: DungeonId) => boolean;
}

export const useDungeonStore = create<DungeonState>()(
  persist(
    (set, get) => ({
      cooldowns: {} as Partial<Record<DungeonId, number>>,
      attempts: {} as Partial<Record<DungeonId, DungeonAttempt>>,
      towerHighestFloor: 0,

      canEnter: (dungeonId: DungeonId) => {
        const dungeon = DUNGEONS.find(d => d.id === dungeonId);
        if (!dungeon) return false;

        const { playerLevel } = useGameStore.getState();
        // Get combat stage from localStorage or default
        const combatStore = JSON.parse(localStorage.getItem('combat-storage') || '{}');
        const currentStage = combatStore.state?.stage || 1;

        // Check level requirement
        if (playerLevel < dungeon.reqLevel) return false;
        if (currentStage < dungeon.reqStage) return false;

        // Check cooldown
        const cooldownEnd = get().cooldowns[dungeonId] || 0;
        if (Date.now() < cooldownEnd) return false;

        // Check if already active (except tower)
        if (dungeonId !== 'endless_tower' && get().isDungeonActive(dungeonId)) return false;

        return true;
      },

      getCooldownRemaining: (dungeonId: DungeonId) => {
        const cooldownEnd = get().cooldowns[dungeonId] || 0;
        return Math.max(0, cooldownEnd - Date.now());
      },

      getCooldownPercent: (dungeonId: DungeonId) => {
        const dungeon = DUNGEONS.find(d => d.id === dungeonId);
        if (!dungeon || dungeon.cooldown === 0) return 0;

        const remaining = get().getCooldownRemaining(dungeonId);
        return ((dungeon.cooldown - remaining) / dungeon.cooldown) * 100;
      },

      enterDungeon: (dungeonId: DungeonId) => {
        if (!get().canEnter(dungeonId)) return false;

        const dungeon = DUNGEONS.find(d => d.id === dungeonId);
        if (!dungeon) return false;

        set((state) => ({
          attempts: {
            ...state.attempts,
            [dungeonId]: {
              dungeonId,
              currentWave: 1,
              maxWaveReached: 0,
              isActive: true,
              startedAt: Date.now(),
            },
          },
        }));

        toast.success(
          `Entered ${dungeon.name}`,
          `Defeat ${dungeon.waves} waves to claim rewards!`,
          3000
        );

        return true;
      },

      completeWave: (dungeonId: DungeonId, wave: number) => {
        set((state) => {
          const attempt = state.attempts[dungeonId];
          if (!attempt) return state;

          const dungeon = DUNGEONS.find(d => d.id === dungeonId);
          const isLastWave = dungeon && dungeon.waves !== Infinity && wave >= dungeon.waves;

          return {
            attempts: {
              ...state.attempts,
              [dungeonId]: {
                ...attempt,
                currentWave: wave + 1,
                maxWaveReached: Math.max(attempt.maxWaveReached, wave),
                isActive: !isLastWave,
              },
            },
          };
        });

        // If endless tower, update highest floor
        if (dungeonId === 'endless_tower') {
          set((state) => ({
            towerHighestFloor: Math.max(state.towerHighestFloor, wave),
          }));
        }
      },

      failDungeon: (dungeonId: DungeonId) => {
        set((state) => ({
          attempts: {
            ...state.attempts,
            [dungeonId]: {
              ...state.attempts[dungeonId],
              isActive: false,
            },
          },
        }));

        toast.error('Dungeon Failed', 'You were defeated! Try again later.', 3000);
      },

      claimRewards: (dungeonId: DungeonId) => {
        const dungeon = DUNGEONS.find(d => d.id === dungeonId);
        const attempt = get().attempts[dungeonId];
        
        if (!dungeon || !attempt || attempt.isActive) return;

        const { addResource } = useGameStore.getState();
        const { getEvolutionBonuses } = useEvolutionStore.getState();
        const evolutionBonuses = getEvolutionBonuses();

        // Calculate rewards based on waves completed
        const waveMultiplier = dungeonId === 'endless_tower' 
          ? Math.min(attempt.maxWaveReached, 10) // Cap at 10x for endless
          : attempt.maxWaveReached / dungeon.waves;

        // Apply evolution bonuses
        const lampBonus = evolutionBonuses.lamps || 1;

        const goldReward = dungeon.rewards.gold.times(waveMultiplier);
        const diamondReward = dungeon.rewards.diamonds.times(waveMultiplier);
        const lampReward = dungeon.rewards.lamps.times(waveMultiplier).times(lampBonus);

        // Give rewards
        if (goldReward.gt(0)) addResource('gold', goldReward);
        if (diamondReward.gt(0)) addResource('diamonds', diamondReward);
        if (lampReward.gt(0)) addResource('lamps', lampReward);

        // Set cooldown
        if (dungeon.cooldown > 0) {
          set((state) => ({
            cooldowns: {
              ...state.cooldowns,
              [dungeonId]: Date.now() + dungeon.cooldown,
            },
          }));
        }

        // Clear attempt
        set((state) => ({
          attempts: {
            ...state.attempts,
            [dungeonId]: null as any,
          },
        }));

        toast.success(
          'Dungeon Complete!',
          `Rewards: ${goldReward.gt(0) ? `+${goldReward.toFixed(0)} Gold ` : ''}${diamondReward.gt(0) ? `+${diamondReward.toFixed(0)} 💎 ` : ''}${lampReward.gt(0) ? `+${lampReward.toFixed(0)} 💡` : ''}`,
          4000
        );
      },

      skipCooldown: (dungeonId: DungeonId) => {
        const dungeon = DUNGEONS.find(d => d.id === dungeonId);
        if (!dungeon || dungeon.cooldown === 0) return false;

        const remaining = get().getCooldownRemaining(dungeonId);
        if (remaining <= 0) return false;

        // Cost: 1 diamond per hour remaining (min 5)
        const hoursRemaining = Math.ceil(remaining / (60 * 60 * 1000));
        const cost = new Decimal(Math.max(5, hoursRemaining));

        const { spendResource } = useGameStore.getState();
        if (!spendResource('diamonds', cost)) {
          toast.error('Not enough diamonds!', `Need ${cost.toFixed(0)} 💎`, 3000);
          return false;
        }

        set((state) => ({
          cooldowns: {
            ...state.cooldowns,
            [dungeonId]: 0,
          },
        }));

        toast.success('Cooldown Skipped!', `Spent ${cost.toFixed(0)} 💎`, 3000);
        return true;
      },

      getAttempt: (dungeonId: DungeonId) => {
        return get().attempts[dungeonId] || null;
      },

      isDungeonActive: (dungeonId: DungeonId) => {
        const attempt = get().attempts[dungeonId];
        return attempt?.isActive || false;
      },
    }),
    {
      name: 'dungeon-storage',
      merge: (persistedState: any, currentState) => {
        const state = persistedState as Partial<DungeonState>;
        if (!state) return currentState;

        return {
          ...currentState,
          ...state,
        };
      },
    }
  )
);
