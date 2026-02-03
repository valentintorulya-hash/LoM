import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Decimal } from '../lib/decimal';
import { useGameStore } from './gameStore';

export interface DailyQuest {
  id: string;
  title: string;
  description: string;
  progress: number;
  goal: number;
  rewardGold: Decimal;
  rewardLamps: Decimal;
  rewardDiamonds: Decimal;
  claimed: boolean;
}

interface QuestState {
  dailyQuests: DailyQuest[];
  claimQuest: (id: string) => void;
  claimAll: () => void;
  setQuestProgress: (id: string, progress: number) => void;
}

const DEFAULT_QUESTS: DailyQuest[] = [
  {
    id: 'daily-1',
    title: 'Lamp Rubbings',
    description: 'Rub the lamp 10 times',
    progress: 6,
    goal: 10,
    rewardGold: new Decimal(300),
    rewardLamps: new Decimal(2),
    rewardDiamonds: new Decimal(0),
    claimed: false,
  },
  {
    id: 'daily-2',
    title: 'Defeat Enemies',
    description: 'Win 15 battles',
    progress: 12,
    goal: 15,
    rewardGold: new Decimal(600),
    rewardLamps: new Decimal(1),
    rewardDiamonds: new Decimal(1),
    claimed: false,
  },
  {
    id: 'daily-3',
    title: 'Equip Gear',
    description: 'Equip 3 items',
    progress: 3,
    goal: 3,
    rewardGold: new Decimal(200),
    rewardLamps: new Decimal(0),
    rewardDiamonds: new Decimal(2),
    claimed: false,
  },
];

export const useQuestStore = create<QuestState>()(
  persist(
    (set, get) => ({
      dailyQuests: DEFAULT_QUESTS,

      claimQuest: (id) => {
        const quests = get().dailyQuests;
        const quest = quests.find((item) => item.id === id);
        if (!quest || quest.claimed || quest.progress < quest.goal) return;

        const { addResource } = useGameStore.getState();
        if (quest.rewardGold.gt(0)) addResource('gold', quest.rewardGold);
        if (quest.rewardLamps.gt(0)) addResource('lamps', quest.rewardLamps);
        if (quest.rewardDiamonds.gt(0)) addResource('diamonds', quest.rewardDiamonds);

        set((state) => ({
          dailyQuests: state.dailyQuests.map((item) =>
            item.id === id ? { ...item, claimed: true } : item
          ),
        }));
      },

      claimAll: () => {
        get().dailyQuests.forEach((quest) => {
          if (!quest.claimed && quest.progress >= quest.goal) {
            get().claimQuest(quest.id);
          }
        });
      },

      setQuestProgress: (id, progress) => {
        set((state) => ({
          dailyQuests: state.dailyQuests.map((quest) =>
            quest.id === id ? { ...quest, progress } : quest
          ),
        }));
      },
    }),
    {
      name: 'quest-storage',
    }
  )
);
