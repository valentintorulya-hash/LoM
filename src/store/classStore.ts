import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Decimal } from '../lib/decimal';
import { useGameStore } from './gameStore';
import { toast } from './toastStore';

export const CLASSES = [
  {
    id: 'warrior',
    name: 'Warrior',
    description: 'A mighty fighter with high HP and defense.',
    icon: '🛡️',
    color: '#E74C3C',
    baseStats: {
      attack: 1.0,
      hp: 1.5,
      defense: 1.3,
      speed: 0.9,
    },
    specialSkill: {
      id: 'shield_bash',
      name: 'Shield Bash',
      description: 'Stuns enemy for 2 seconds and deals 150% damage',
      cooldown: 10000, // 10s
      damageMultiplier: 1.5,
      stunDuration: 2000,
      icon: '🛡️',
    },
    bonuses: [
      '+50% HP',
      '+30% Defense',
      '-10% Speed',
    ],
  },
  {
    id: 'mage',
    name: 'Mage',
    description: 'A powerful spellcaster with devastating magic.',
    icon: '🔮',
    color: '#9B59B6',
    baseStats: {
      attack: 1.5,
      hp: 0.8,
      defense: 0.7,
      speed: 1.1,
    },
    specialSkill: {
      id: 'meteor',
      name: 'Meteor',
      description: 'Deals 300% damage to enemy',
      cooldown: 15000, // 15s
      damageMultiplier: 3.0,
      icon: '☄️',
    },
    bonuses: [
      '+50% Attack',
      '+30% Skill Damage',
      '-20% HP',
      '-30% Defense',
    ],
  },
  {
    id: 'archer',
    name: 'Archer',
    description: 'A swift marksman with high crit chance.',
    icon: '🏹',
    color: '#27AE60',
    baseStats: {
      attack: 1.2,
      hp: 0.9,
      defense: 0.8,
      speed: 1.4,
    },
    specialSkill: {
      id: 'multishot',
      name: 'Multi-Shot',
      description: 'Attacks 3 times rapidly for 80% damage each',
      cooldown: 12000, // 12s
      damageMultiplier: 0.8,
      attacks: 3,
      icon: '🎯',
    },
    bonuses: [
      '+40% Speed',
      '+30% Crit Chance',
      '-10% HP',
      '-20% Defense',
    ],
  },
] as const;

export type ClassId = typeof CLASSES[number]['id'];

export interface ClassState {
  selectedClassId: ClassId | null;
  classLevels: Record<ClassId, number>;
  classExp: Record<ClassId, Decimal>;
  specialSkillCooldowns: Record<string, number>;
  
  // Actions
  selectClass: (classId: ClassId) => boolean;
  getSelectedClass: () => typeof CLASSES[number] | null;
  getClassMultiplier: (stat: 'attack' | 'hp' | 'defense' | 'speed') => number;
  useSpecialSkill: () => boolean;
  isSpecialSkillReady: () => boolean;
  getSpecialSkillCooldownPercent: () => number;
  addClassExp: (amount: Decimal) => void;
  getClassLevel: () => number;
}

export const useClassStore = create<ClassState>()(
  persist(
    (set, get) => ({
      selectedClassId: null,
      classLevels: { warrior: 1, mage: 1, archer: 1 },
      classExp: { 
        warrior: new Decimal(0), 
        mage: new Decimal(0), 
        archer: new Decimal(0) 
      },
      specialSkillCooldowns: {},

      selectClass: (classId: ClassId) => {
        const gameState = useGameStore.getState();
        
        // Can only select class if level >= 5 (first time only)
        if (!get().selectedClassId && gameState.playerLevel < 5) {
          toast.error('Reach level 5 to choose your class!');
          return false;
        }

        // Changing class costs diamonds
        if (get().selectedClassId && get().selectedClassId !== classId) {
          const cost = new Decimal(100);
          if (!gameState.spendResource('diamonds', cost)) {
            toast.error('Not enough diamonds to change class!');
            return false;
          }
        }

        set({ selectedClassId: classId });
        
        const classData = CLASSES.find(c => c.id === classId);
        toast.success(
          `Class Selected: ${classData?.name}`,
          classData?.description || '',
          4000
        );
        
        return true;
      },

      getSelectedClass: () => {
        const id = get().selectedClassId;
        if (!id) return null;
        return CLASSES.find(c => c.id === id) || null;
      },

      getClassMultiplier: (stat: 'attack' | 'hp' | 'defense' | 'speed') => {
        const selectedClass = get().getSelectedClass();
        if (!selectedClass) return 1;
        return selectedClass.baseStats[stat] || 1;
      },

      useSpecialSkill: () => {
        const selectedClass = get().getSelectedClass();
        if (!selectedClass) return false;

        const skillId = selectedClass.specialSkill.id;
        const now = Date.now();
        const readyAt = get().specialSkillCooldowns[skillId] || 0;

        if (now < readyAt) return false;

        set((state) => ({
          specialSkillCooldowns: {
            ...state.specialSkillCooldowns,
            [skillId]: now + selectedClass.specialSkill.cooldown,
          },
        }));

        return true;
      },

      isSpecialSkillReady: () => {
        const selectedClass = get().getSelectedClass();
        if (!selectedClass) return false;

        const skillId = selectedClass.specialSkill.id;
        const now = Date.now();
        const readyAt = get().specialSkillCooldowns[skillId] || 0;

        return now >= readyAt;
      },

      getSpecialSkillCooldownPercent: () => {
        const selectedClass = get().getSelectedClass();
        if (!selectedClass) return 0;

        const skillId = selectedClass.specialSkill.id;
        const now = Date.now();
        const readyAt = get().specialSkillCooldowns[skillId] || 0;
        const cooldown = selectedClass.specialSkill.cooldown;

        if (now >= readyAt) return 0;

        const remaining = readyAt - now;
        return (remaining / cooldown) * 100;
      },

      addClassExp: (amount: Decimal) => {
        const selectedClassId = get().selectedClassId;
        if (!selectedClassId) return;

        set((state) => {
          const currentExp = state.classExp[selectedClassId] || new Decimal(0);
          const currentLevel = state.classLevels[selectedClassId] || 1;
          
          let newExp = currentExp.plus(amount);
          let newLevel = currentLevel;
          
          // Level up formula: 1000 * 1.5^(level-1)
          const expToNext = new Decimal(1000).times(Decimal.pow(1.5, currentLevel - 1));
          
          while (newExp.gte(expToNext)) {
            newExp = newExp.minus(expToNext);
            newLevel++;
            toast.success(
              'Class Level Up!',
              `${CLASSES.find(c => c.id === selectedClassId)?.name} is now level ${newLevel}!`,
              3000
            );
          }

          return {
            classExp: {
              ...state.classExp,
              [selectedClassId]: newExp,
            },
            classLevels: {
              ...state.classLevels,
              [selectedClassId]: newLevel,
            },
          };
        });
      },

      getClassLevel: () => {
        const selectedClassId = get().selectedClassId;
        if (!selectedClassId) return 0;
        return get().classLevels[selectedClassId] || 1;
      },
    }),
    {
      name: 'class-storage',
      merge: (persistedState: any, currentState) => {
        const state = persistedState as Partial<ClassState>;
        if (!state) return currentState;

        // Revive Decimals
        const revivedExp: Record<ClassId, Decimal> = { warrior: new Decimal(0), mage: new Decimal(0), archer: new Decimal(0) };
        if (state.classExp) {
          Object.entries(state.classExp).forEach(([key, value]) => {
            revivedExp[key as ClassId] = new Decimal(value as any);
          });
        }

        return {
          ...currentState,
          ...state,
          classExp: revivedExp,
        };
      },
    }
  )
);
