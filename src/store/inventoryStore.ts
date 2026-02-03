import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ItemSlot, StatType } from '../lib/gameTypes';
import type { Item } from '../lib/gameTypes';
import { Decimal } from '../lib/decimal';

interface InventoryState {
  equipped: Partial<Record<ItemSlot, Item>>;
  currentItem: Item | null;
  lootQueue: Item[];
  playerStats: Record<StatType, Decimal>;
  currentHp: Decimal;
  
  setNewItem: (item: Item) => void;
  enqueueLoot: (item: Item) => void;
  advanceLootQueue: () => void;
  equipCurrentItem: () => Item | null;
  discardCurrentItem: () => void;
  recalculateStats: () => void;
  takeDamage: (amount: Decimal) => void;
  fullHeal: () => void;
  applyMultipliers: (multipliers: { attack?: number; hp?: number; defense?: number; speed?: number }) => void;
}

const reviveItem = (data: any): Item => {
  return {
    ...data,
    mainStat: {
      ...data.mainStat,
      value: new Decimal(data.mainStat.value),
    },
    sellPrice: new Decimal(data.sellPrice),
    expValue: new Decimal(data.expValue),
  };
};

export const useInventoryStore = create<InventoryState>()(
  persist(
    (set, get) => ({
      equipped: {},
      currentItem: null,
      lootQueue: [],
      playerStats: {
        [StatType.ATTACK]: new Decimal(10),
        [StatType.HP]: new Decimal(100),
        [StatType.DEFENSE]: new Decimal(0),
        [StatType.SPEED]: new Decimal(1),
      },
      currentHp: new Decimal(100),

      setNewItem: (item) => set({ currentItem: item, lootQueue: [] }),

      enqueueLoot: (item) => set((state) => ({
        lootQueue: [...state.lootQueue, item],
      })),

      advanceLootQueue: () => set((state) => {
        if (state.lootQueue.length === 0) {
          return { currentItem: null };
        }
        const [nextItem, ...rest] = state.lootQueue;
        return { currentItem: nextItem, lootQueue: rest };
      }),

      takeDamage: (amount) => {
        set((state) => {
          const newHp = state.currentHp.minus(amount);
          return { currentHp: newHp.lt(0) ? new Decimal(0) : newHp };
        });
      },

      fullHeal: () => {
        set((state) => ({ currentHp: state.playerStats[StatType.HP] }));
      },

      equipCurrentItem: () => {
        const { currentItem, equipped } = get();
        if (!currentItem) return null;

        const slot = currentItem.slot;
        const oldItem = equipped[slot] || null;

        set({
          equipped: { ...equipped, [slot]: currentItem },
          currentItem: null,
        });

        get().recalculateStats();
        return oldItem;
      },

      discardCurrentItem: () => {
        set({ currentItem: null });
      },

      recalculateStats: () => {
        const { equipped, currentHp } = get();
        // Base Stats
        const newStats: Record<StatType, Decimal> = {
          [StatType.ATTACK]: new Decimal(10),
          [StatType.HP]: new Decimal(100),
          [StatType.DEFENSE]: new Decimal(0),
          [StatType.SPEED]: new Decimal(1),
        };

        Object.values(equipped).forEach((item) => {
          if (!item) return;
          
          const main = item.mainStat;
          if (newStats[main.type]) {
            newStats[main.type] = newStats[main.type].plus(main.value);
          }
        });
        
        let newCurrentHp = currentHp;
        if (newCurrentHp.gt(newStats[StatType.HP])) {
            newCurrentHp = newStats[StatType.HP];
        }

        set({ playerStats: newStats, currentHp: newCurrentHp });
      },

      // Apply multipliers to base stats (called from components with evolution/class bonuses)
      applyMultipliers: (multipliers: { attack?: number; hp?: number; defense?: number; speed?: number }) => {
        const { playerStats } = get();
        
        const newStats = { ...playerStats };
        
        if (multipliers.attack) {
          newStats[StatType.ATTACK] = newStats[StatType.ATTACK].times(multipliers.attack);
        }
        if (multipliers.hp) {
          newStats[StatType.HP] = newStats[StatType.HP].times(multipliers.hp);
        }
        if (multipliers.defense) {
          newStats[StatType.DEFENSE] = newStats[StatType.DEFENSE].times(multipliers.defense);
        }
        if (multipliers.speed) {
          newStats[StatType.SPEED] = newStats[StatType.SPEED].times(multipliers.speed);
        }

        set({ playerStats: newStats });
      },
    }),
    {
      name: 'inventory-storage',
      merge: (persistedState: any, currentState) => {
        const state = persistedState as Partial<InventoryState>;
        if (!state) return currentState;

        const revivedEquipped: Partial<Record<ItemSlot, Item>> = {};
        if (state.equipped) {
          Object.entries(state.equipped).forEach(([slot, item]) => {
            if (item) revivedEquipped[slot as ItemSlot] = reviveItem(item);
          });
        }

        const revivedStats: any = {};
        if (state.playerStats) {
          Object.entries(state.playerStats).forEach(([stat, val]) => {
            revivedStats[stat] = new Decimal(val as any);
          });
        }

        const revivedQueue: Item[] = [];
        if (state.lootQueue && Array.isArray(state.lootQueue)) {
          state.lootQueue.forEach((item) => {
            if (item) revivedQueue.push(reviveItem(item));
          });
        }

        return {
          ...currentState,
          ...state,
          equipped: revivedEquipped,
          currentItem: state.currentItem ? reviveItem(state.currentItem) : null,
          lootQueue: revivedQueue,
          playerStats: Object.keys(revivedStats).length > 0 ? revivedStats : currentState.playerStats,
          currentHp: state.currentHp ? new Decimal(state.currentHp) : currentState.currentHp,
        };
      }
    }
  )
);