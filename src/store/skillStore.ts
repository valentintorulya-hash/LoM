import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SkillType } from '../lib/gameTypes';
import type { Skill } from '../lib/gameTypes';

// Static Data
export const SKILLS_DATA: Skill[] = [
  {
    id: 'fireball',
    name: 'Fireball',
    type: SkillType.DAMAGE,
    cooldown: 5000, // 5s
    value: 5, // 500% Attack Damage
    unlockStage: 1,
    iconId: 1, // Flame
  },
  {
    id: 'rage',
    name: 'Rage',
    type: SkillType.BUFF,
    cooldown: 15000, // 15s
    duration: 5000, // 5s active
    value: 2, // 2x Attack
    unlockStage: 5,
    iconId: 2, // Zap
  },
  {
    id: 'heal',
    name: 'Restoration',
    type: SkillType.BUFF, // Special handling
    cooldown: 20000,
    value: 0.5, // Heal 50% HP
    unlockStage: 10,
    iconId: 3, // Sparkles
  },
];

interface SkillState {
  cooldowns: Record<string, number>; // { skillId: timestamp_ready }
  activeBuffs: Record<string, number>; // { skillId: timestamp_expire }
  
  activateSkill: (skillId: string) => boolean;
  isReady: (skillId: string) => boolean;
  getBuffMultiplier: (skillId: string) => number;
}

export const useSkillStore = create<SkillState>()(
  persist(
    (set, get) => ({
      cooldowns: {},
      activeBuffs: {},

      isReady: (skillId) => {
        const readyAt = get().cooldowns[skillId] || 0;
        return Date.now() >= readyAt;
      },

      activateSkill: (skillId) => {
        const skill = SKILLS_DATA.find(s => s.id === skillId);
        if (!skill) return false;
        
        const now = Date.now();
        const readyAt = get().cooldowns[skillId] || 0;

        if (now >= readyAt) {
          // Activate
          const newCooldowns = { ...get().cooldowns, [skillId]: now + skill.cooldown };
          let newBuffs = get().activeBuffs;

          if (skill.type === SkillType.BUFF && skill.duration) {
            newBuffs = { ...newBuffs, [skillId]: now + skill.duration };
          }

          set({ cooldowns: newCooldowns, activeBuffs: newBuffs });
          return true;
        }
        return false;
      },

      getBuffMultiplier: (skillId) => {
         const skill = SKILLS_DATA.find(s => s.id === skillId);
         if (!skill || skill.type !== SkillType.BUFF) return 1;

         const expireAt = get().activeBuffs[skillId] || 0;
         if (Date.now() < expireAt) {
           return skill.value;
         }
         return 1;
      },
    }),
    {
      name: 'skill-storage',
    }
  )
);