import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Enemy } from '../lib/gameTypes';
import { generateEnemy } from '../lib/enemyLogic';
import { Decimal } from '../lib/decimal';

export interface DamageInstance {
  id: string;
  damage: Decimal;
  x: number;
  y: number;
  isCritical: boolean;
  isPlayerDamage: boolean; // true = enemy takes damage, false = player takes damage
  slotId: number;
  createdAt: number;
}

export interface ParticleEvent {
  id: string;
  x: number;
  y: number;
  type: 'hit' | 'critical' | 'heal';
}

interface CombatState {
  stage: number;
  enemy: Enemy | null;
  autoFight: boolean;
  damageInstances: DamageInstance[];
  particleEvents: ParticleEvent[];
  damageIndex: { player: number; enemy: number };
  damageSlots: { player: boolean[]; enemy: boolean[] };
  
  nextStage: () => void;
  previousStage: () => void;
  setStage: (stage: number) => void;
  spawnEnemy: () => void;
  damageEnemy: (amount: Decimal, isCritical?: boolean) => void;
  healEnemy: () => void; 
  toggleAutoFight: () => void;
  addDamageInstance: (damage: Decimal, x: number, y: number, isCritical: boolean, isPlayerDamage: boolean) => void;
  removeDamageInstance: (id: string) => void;
  addParticleEvent: (x: number, y: number, type: 'hit' | 'critical' | 'heal') => void;
  removeParticleEvent: (id: string) => void;
}

export const useCombatStore = create<CombatState>()(
  persist(
    (set, get) => ({
      stage: 1,
      enemy: null,
      autoFight: true,
      damageInstances: [],
      particleEvents: [],
      damageIndex: { player: 0, enemy: 0 },
      damageSlots: {
        player: Array.from({ length: 18 }, () => false),
        enemy: Array.from({ length: 18 }, () => false),
      },

      nextStage: () => {
        set((state) => ({ stage: state.stage + 1 }));
        get().spawnEnemy();
      },

      previousStage: () => {
        set((state) => ({ stage: Math.max(1, state.stage - 1) }));
        get().spawnEnemy();
      },

      setStage: (stage) => {
        set({ stage: Math.max(1, stage) });
        get().spawnEnemy();
      },

      spawnEnemy: () => {
        const { stage } = get();
        const newEnemy = generateEnemy(stage);
        set({ enemy: newEnemy });
      },

      damageEnemy: (amount: Decimal, isCritical = false) => {
        set((state) => {
          if (!state.enemy) return {};
          const newHp = state.enemy.currentHp.minus(amount);
          
          // Add damage instance for visual effect
          // Enemy takes damage, so show on right side (around x: 75% of container)
          const x = 300;
          const y = 120;
          
          get().addDamageInstance(amount, x, y, isCritical, true);
          get().addParticleEvent(x, y, isCritical ? 'critical' : 'hit');
          
          return {
            enemy: {
              ...state.enemy,
              currentHp: newHp.lt(0) ? new Decimal(0) : newHp,
            },
          };
        });
      },

      healEnemy: () => {
         set((state) => {
          if (!state.enemy) return {};
          return {
            enemy: {
              ...state.enemy,
              currentHp: state.enemy.maxHp,
            },
          };
        });
      },

      toggleAutoFight: () => set((state) => ({ autoFight: !state.autoFight })),

      addDamageInstance: (damage: Decimal, x: number, y: number, isCritical: boolean, isPlayerDamage: boolean) => {
        const id = `${Date.now()}-${Math.random()}`;
        const createdAt = Date.now();

        set((state) => {
          const sideKey = isPlayerDamage ? 'enemy' : 'player';
          const sideInstances = state.damageInstances.filter((instance) => instance.isPlayerDamage === isPlayerDamage);
          const recent = sideInstances.reduce<DamageInstance | null>((prev, curr) => {
            if (!prev) return curr;
            return curr.createdAt > prev.createdAt ? curr : prev;
          }, null);
          const mergeWindowMs = 220;

          if (recent && createdAt - recent.createdAt < mergeWindowMs) {
            return {
              damageInstances: state.damageInstances.map((instance) =>
                instance.id === recent.id
                  ? {
                      ...instance,
                      damage: instance.damage.plus(damage),
                      isCritical: instance.isCritical || isCritical,
                      createdAt,
                    }
                  : instance
              ),
            };
          }

          const index = state.damageIndex[sideKey];
          const slots = [
            { x: -90, y: -50 },
            { x: -40, y: -65 },
            { x: 0, y: -70 },
            { x: 40, y: -65 },
            { x: 90, y: -50 },
            { x: -100, y: -10 },
            { x: 100, y: -10 },
            { x: -90, y: 25 },
            { x: -40, y: 45 },
            { x: 0, y: 55 },
            { x: 40, y: 45 },
            { x: 90, y: 25 },
            { x: -60, y: -25 },
            { x: 60, y: -25 },
            { x: -60, y: 15 },
            { x: 60, y: 15 },
            { x: -20, y: 15 },
            { x: 20, y: 15 },
          ];

          const sideSlots = state.damageSlots[sideKey];
          const maxVisible = 8;

          let nextInstances = state.damageInstances;
          let nextSlots = sideSlots;
          let reusedSlotId: number | null = null;

          if (sideInstances.length >= maxVisible) {
            const oldest = sideInstances.reduce((prev, curr) => (curr.createdAt < prev.createdAt ? curr : prev));
            reusedSlotId = oldest.slotId;
            nextInstances = state.damageInstances.filter((item) => item.id !== oldest.id);
            nextSlots = sideSlots.map((used, idx) => (idx === oldest.slotId ? false : used));
          }

          let slotId = reusedSlotId ?? nextSlots.findIndex((used) => !used);
          if (slotId === -1) {
            slotId = index % slots.length;
          }

          const slot = slots[slotId % slots.length];
          const waveOffset = Math.floor(index / slots.length) * 10;
          const nextSlotsFinal = nextSlots.map((used, idx) => (idx === slotId ? true : used));

          return {
            damageInstances: [
              ...nextInstances,
              {
                id,
                damage,
                x: x + slot.x,
                y: y + slot.y + waveOffset,
                isCritical,
                isPlayerDamage,
                slotId,
                createdAt,
              },
            ],
            damageIndex: {
              ...state.damageIndex,
              [sideKey]: index + 1,
            },
            damageSlots: {
              ...state.damageSlots,
              [sideKey]: nextSlotsFinal,
            },
          };
        });
      },

      removeDamageInstance: (id: string) => {
        set((state) => {
          const instance = state.damageInstances.find((item) => item.id === id);
          if (!instance) {
            return {
              damageInstances: state.damageInstances.filter((item) => item.id !== id),
            };
          }

          const sideKey = instance.isPlayerDamage ? 'enemy' : 'player';
          const sideSlots = state.damageSlots[sideKey];
          const nextSlots = sideSlots.map((used, idx) => (idx === instance.slotId ? false : used));

          return {
            damageInstances: state.damageInstances.filter((item) => item.id !== id),
            damageSlots: {
              ...state.damageSlots,
              [sideKey]: nextSlots,
            },
          };
        });
      },

      addParticleEvent: (x: number, y: number, type: 'hit' | 'critical' | 'heal') => {
        const id = `${Date.now()}-${Math.random()}`;
        set((state) => ({
          particleEvents: [...state.particleEvents, { id, x, y, type }],
        }));
      },

      removeParticleEvent: (id: string) => {
        set((state) => ({
          particleEvents: state.particleEvents.filter((event) => event.id !== id),
        }));
      },
    }),
    {
      name: 'combat-storage',
      partialize: (state) => ({ stage: state.stage, autoFight: state.autoFight }), // Only save stage and autoFight
    }
  )
);
