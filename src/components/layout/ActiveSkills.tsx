import React, { useEffect, useState } from 'react';
import { Sparkles, Flame, Zap } from 'lucide-react';
import { useSkillStore, SKILLS_DATA } from '../../store/skillStore';
import { useSkillController } from '../game/Combat/useSkillController';
import { useCombatController } from '../game/Combat/useCombatController';
import type { Skill } from '../../lib/gameTypes';

export const ActiveSkills: React.FC = () => {
  const { cooldowns, activeBuffs } = useSkillStore();
  const { handleSkillClick } = useSkillController();
  const { stage } = useCombatController();
  const [now, setNow] = useState(Date.now());

  // Update timer for cooldown visuals
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 100);
    return () => clearInterval(interval);
  }, []);

  const getIcon = (id: number) => {
    switch(id) {
      case 1: return <Flame size={16} />;
      case 2: return <Zap size={16} />;
      case 3: return <Sparkles size={16} />;
      default: return <Flame size={16} />;
    }
  };

  const getColor = (id: string) => {
     switch(id) {
       case 'fireball': return 'bg-red-500';
       case 'rage': return 'bg-blue-500';
       case 'heal': return 'bg-green-500';
       default: return 'bg-gray-500';
     }
  };

  return (
    <div className="flex justify-center gap-3 px-4 py-2 bg-[#e6d5b8] border-b-2 border-[#d4c5a9] relative z-20">
      {SKILLS_DATA.map((skill: Skill) => {
        const isLocked = stage < skill.unlockStage;
        const readyAt = cooldowns[skill.id] || 0;
        const isCooldown = now < readyAt;
        const expireAt = activeBuffs[skill.id] || 0;
        const isActive = now < expireAt;
        
        // Calculate CD overlay height
        let cdPercent = 0;
        if (isCooldown) {
           const totalCd = skill.cooldown;
           const remaining = readyAt - now;
           cdPercent = Math.min(100, Math.max(0, (remaining / totalCd) * 100));
        }

        return (
          <button
            key={skill.id}
            disabled={isLocked || isCooldown}
            onClick={() => handleSkillClick(skill.id)}
            className={`
              w-10 h-10 rounded-full border-2 border-[#c2b295] flex items-center justify-center text-white shadow-md transition-transform active:scale-95 relative overflow-hidden
              ${isLocked ? 'bg-gray-400 grayscale opacity-50 cursor-not-allowed' : `${getColor(skill.id)} hover:brightness-110`}
              ${isActive ? 'ring-2 ring-yellow-400 animate-pulse' : ''}
            `}
          >
            {isLocked ? <span className="text-xs">🔒</span> : getIcon(skill.iconId)}
            
            {/* Cooldown Overlay */}
            {!isLocked && isCooldown && (
               <div 
                 className="absolute bottom-0 left-0 w-full bg-black/60 transition-all duration-100"
                 style={{ height: `${cdPercent}%` }}
               />
            )}
            
            {/* Level Requirement (if locked) */}
             {isLocked && (
               <div className="absolute -bottom-4 text-[8px] text-gray-600 font-bold whitespace-nowrap">
                  Lv.{skill.unlockStage}
               </div>
             )}
          </button>
        );
      })}
    </div>
  );
};