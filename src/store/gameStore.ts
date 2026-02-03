import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Decimal } from '../lib/decimal';

// --- Types ---

export interface Currencies {
  lamps: Decimal;
  gold: Decimal;
  diamonds: Decimal;
}

interface LampProgress {
  level: number;
  progress: number;
  toNextLevel: number;
}

interface GameState {
  currencies: Currencies;
  lamp: LampProgress;
  // Economy & Profile
  lampsPerMinute: Decimal;
  playerLevel: number;
  playerExp: Decimal;
  expToNextLevel: Decimal;

  lampAutoMode: boolean;
  lampAutoBatch: 1 | 10;

  addResource: (resource: keyof Currencies, amount: Decimal | number) => void;
  spendResource: (resource: keyof Currencies, amount: Decimal | number) => boolean;
  addLampProgress: () => void;
  setLampAutoMode: (value: boolean) => void;
  setLampAutoBatch: (value: 1 | 10) => void;
  toggleLampAutoMode: () => void;
  
  // New Methods
  addPlayerExp: (amount: Decimal) => void;
  onEnemyDefeated: () => void;
  generateIdleLamps: (deltaSeconds: number, overrideRate?: Decimal) => void;
}

const initialCurrencies: Currencies = {
  lamps: new Decimal(0),
  gold: new Decimal(0),
  diamonds: new Decimal(0),
};

const initialLamp: LampProgress = {
  level: 1,
  progress: 0,
  toNextLevel: 10,
};

const calculateNextLevelReq = (level: number) => {
  return Math.floor(10 * Math.pow(1.2, level - 1));
};

// Player Level Curve: Base 100 * 1.5^(Level-1)
const calculatePlayerLevelReq = (level: number) => {
  return new Decimal(100).times(Decimal.pow(1.5, level - 1)).floor();
};

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      currencies: initialCurrencies,
      lamp: initialLamp,
      
      lampsPerMinute: new Decimal(5), 
      playerLevel: 1,
      playerExp: new Decimal(0),
      expToNextLevel: calculatePlayerLevelReq(1),
      lampAutoMode: false,
      lampAutoBatch: 1,

      addResource: (resource, amount) => {
        set((state) => {
          const valueToAdd = new Decimal(amount);
          const currentAmount = state.currencies[resource];
          
          return {
            currencies: {
              ...state.currencies,
              [resource]: currentAmount.plus(valueToAdd),
            },
          };
        });
      },

      spendResource: (resource, amount) => {
        const valueToSpend = new Decimal(amount);
        const currentAmount = get().currencies[resource];

        if (currentAmount.gte(valueToSpend)) {
          set((state) => ({
            currencies: {
              ...state.currencies,
              [resource]: state.currencies[resource].minus(valueToSpend),
            },
          }));
          return true;
        }
        
        return false;
      },

      addLampProgress: () => {
        set((state) => {
          let { level, progress, toNextLevel } = state.lamp;
          progress += 1;
          if (progress >= toNextLevel) {
            progress = 0;
            level++;
            toNextLevel = calculateNextLevelReq(level);
          }
          return {
            lamp: { level, progress, toNextLevel },
          };
        });
      },

      setLampAutoMode: (value) => set({ lampAutoMode: value }),
      setLampAutoBatch: (value) => set({ lampAutoBatch: value }),
      toggleLampAutoMode: () => set((state) => ({ lampAutoMode: !state.lampAutoMode })),

      addPlayerExp: (amount: Decimal) => {
        set((state) => {
          let { playerLevel, playerExp, expToNextLevel } = state;
          const currencies = { ...state.currencies };
          
          playerExp = playerExp.plus(amount);
          let leveledUp = false;

          while (playerExp.gte(expToNextLevel)) {
            playerExp = playerExp.minus(expToNextLevel);
            playerLevel++;
            leveledUp = true;
            expToNextLevel = calculatePlayerLevelReq(playerLevel);

            const reward = new Decimal(playerLevel).times(10);
            currencies.lamps = currencies.lamps.plus(reward);
          }

          // Show toast notification on level up
          if (leveledUp) {
            // Dynamically import toast to avoid circular dependencies
            import('./toastStore').then(({ toast }) => {
              toast.success(
                `Level Up! 🎉`,
                `You reached level ${playerLevel}! +${playerLevel * 10} Lamps`,
                4000
              );
            });
          }

          return {
            playerLevel,
            playerExp,
            expToNextLevel,
            currencies,
          };
        });
      },

      onEnemyDefeated: () => {
        if (Math.random() < 0.3) {
          const amount = Math.random() < 0.5 ? 1 : 2;
          get().addResource('lamps', amount);
        }
      },

      generateIdleLamps: (deltaSeconds: number, overrideRate?: Decimal) => {
        const rate = overrideRate || get().lampsPerMinute;
        if (rate.eq(0)) return;

        const generated = rate.div(60).times(deltaSeconds);
        get().addResource('lamps', generated);
      },
    }),
    {
      name: 'game-storage',
      storage: createJSONStorage(() => ({
        getItem: (name) => localStorage.getItem(name),
        setItem: (name, value) => localStorage.setItem(name, value),
        removeItem: (name) => localStorage.removeItem(name),
      })),
      // Revive Decimals
      merge: (persistedState: any, currentState) => {
        const state = persistedState as Partial<GameState>;
        if (!state) return currentState;

        return {
          ...currentState,
          ...state,
          currencies: state.currencies ? {
            lamps: new Decimal(state.currencies.lamps),
            gold: new Decimal(state.currencies.gold),
            diamonds: new Decimal(state.currencies.diamonds),
          } : currentState.currencies,
          lampsPerMinute: state.lampsPerMinute ? new Decimal(state.lampsPerMinute) : currentState.lampsPerMinute,
          playerExp: state.playerExp ? new Decimal(state.playerExp) : currentState.playerExp,
          expToNextLevel: state.expToNextLevel ? new Decimal(state.expToNextLevel) : currentState.expToNextLevel,
          lampAutoMode: typeof state.lampAutoMode === 'boolean' ? state.lampAutoMode : currentState.lampAutoMode,
          lampAutoBatch: state.lampAutoBatch === 10 ? 10 : 1,
        };
      }
    }
  )
);