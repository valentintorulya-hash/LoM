import React, { useEffect, useState } from 'react';
import { Flame, Sparkles, Swords, Zap } from 'lucide-react';
import { useCombatController } from '../game/Combat/useCombatController';
import { useCombatStore } from '../../store/combatStore';
import { useSkillController } from '../game/Combat/useSkillController';
import { useSkillStore, SKILLS_DATA } from '../../store/skillStore';
import type { Skill } from '../../lib/gameTypes';

interface ActionButtonsProps {
  className?: string;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({ className }) => {
  const { cooldowns, activeBuffs } = useSkillStore();
  const { handleSkillClick } = useSkillController();
  const { stage } = useCombatController();
  const { autoFight, toggleAutoFight } = useCombatStore();
  const [now, setNow] = useState(Date.now());
  const [justBecameReady, setJustBecameReady] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const interval = setInterval(() => {
      const currentTime = Date.now();
      setNow(currentTime);

      const newReadyStates: Record<string, boolean> = {};
      SKILLS_DATA.forEach((skill: Skill) => {
        const readyAt = cooldowns[skill.id] || 0;
        const wasOnCooldown = readyAt > currentTime - 100;
        const isNowReady = readyAt <= currentTime;

        if (wasOnCooldown && isNowReady && !justBecameReady[skill.id]) {
          newReadyStates[skill.id] = true;
          setTimeout(() => {
            setJustBecameReady((prev) => ({ ...prev, [skill.id]: false }));
          }, 1000);
        }
      });

      if (Object.keys(newReadyStates).length > 0) {
        setJustBecameReady((prev) => ({ ...prev, ...newReadyStates }));
      }
    }, 100);
    return () => clearInterval(interval);
  }, [cooldowns, justBecameReady]);

  const getIcon = (id: number) => {
    switch (id) {
      case 1:
        return <Flame size={16} />;
      case 2:
        return <Zap size={16} />;
      case 3:
        return <Sparkles size={16} />;
      default:
        return <Flame size={16} />;
    }
  };

  const getGradient = (id: string) => {
    switch (id) {
      case 'fireball':
        return 'from-red-500 to-red-600';
      case 'rage':
        return 'from-purple-500 to-purple-600';
      case 'heal':
        return 'from-green-500 to-green-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <div className={`flex justify-center items-center gap-1.5 py-2 px-1 ${className || ''}`}>
      {SKILLS_DATA.map((skill: Skill) => {
        const isLocked = stage < skill.unlockStage;
        const readyAt = cooldowns[skill.id] || 0;
        const isCooldown = now < readyAt;
        const expireAt = activeBuffs[skill.id] || 0;
        const isActive = now < expireAt;

        let cdPercent = 0;
        if (isCooldown) {
          const totalCd = skill.cooldown;
          const remaining = readyAt - now;
          cdPercent = Math.min(100, Math.max(0, (remaining / totalCd) * 100));
        }

        const skillJustReady = justBecameReady[skill.id];

        return (
          <button
            key={skill.id}
            disabled={isLocked || isCooldown}
            onClick={() => handleSkillClick(skill.id)}
            className={`relative w-10 h-10 rounded-full shadow-lg transition-all active:scale-90 overflow-hidden shrink-0
              ${skillJustReady ? 'animate-bounce' : ''}
            `}
          >
            <div className="absolute inset-0 rounded-full bg-gradient-to-b from-[#7f5a39] to-[#5a3d25] border-2 border-[#d2b07a] shadow-inner" />
            <div
              className={`absolute inset-1 rounded-full border-2 border-[#fff1cc] flex items-center justify-center text-white
                ${isLocked ? 'bg-[#4b3a2c]' : `bg-gradient-to-br ${getGradient(skill.id)}`}
              `}
            />

            <div className="relative z-10 w-full h-full flex items-center justify-center text-white">
              {isLocked ? <span className="text-xs">🔒</span> : getIcon(skill.iconId)}
            </div>

            {isCooldown && !isLocked && (
              <>
                <div className="absolute inset-0 bg-black/60 z-20"></div>

                <svg className="absolute inset-0 w-full h-full z-20 -rotate-90" viewBox="0 0 56 56">
                  <circle cx="28" cy="28" r="24" fill="none" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="3" />
                  <circle
                    cx="28"
                    cy="28"
                    r="24"
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.9)"
                    strokeWidth="3"
                    strokeDasharray={`${2 * Math.PI * 24}`}
                    strokeDashoffset={`${2 * Math.PI * 24 * (cdPercent / 100)}`}
                    className="transition-all duration-100"
                    strokeLinecap="round"
                  />
                </svg>

                <div className="absolute inset-0 flex items-center justify-center z-30">
                  <span className="text-white text-[10px] font-black drop-shadow-lg">
                    {Math.ceil((readyAt - now) / 1000)}
                  </span>
                </div>
              </>
            )}

            {isActive && (
              <div className="absolute inset-0 bg-[#ffd27a]/20 animate-pulse"></div>
            )}

            {skillJustReady && !isLocked && (
              <div className="absolute -inset-1 rounded-full bg-white/50 animate-ping pointer-events-none"></div>
            )}
          </button>
        );
      })}

      <button
        onClick={toggleAutoFight}
        className={`relative w-11 h-11 rounded-full shadow-xl transition-all active:scale-90 shrink-0 mx-1
          ${autoFight
            ? 'bg-gradient-to-b from-[#ffb15a] to-[#d46b2a] border-2 border-[#ffd9a3]'
            : 'bg-gradient-to-b from-[#6b4a2c] to-[#4b321e] border-2 border-[#c9a46a]'
          }
          hover:scale-110
        `}
      >
        <div className="absolute inset-1 rounded-full bg-gradient-to-b from-[#2b1f14] to-[#3a2a1a] border border-[#d2b07a]" />
        <div className="relative z-10 w-full h-full flex flex-col items-center justify-center text-white">
          <Swords size={16} className={autoFight ? 'animate-pulse' : ''} />
          <span className="text-[7px] font-black mt-0.5">{autoFight ? 'ON' : 'OFF'}</span>
        </div>

        {autoFight && (
          <div className="absolute inset-0 rounded-full bg-[#ffd27a]/30 animate-ping"></div>
        )}
      </button>

      {[1, 2, 3].map((i) => (
        <button
          key={`empty-${i}`}
          disabled
          className="relative w-10 h-10 rounded-full border-2 border-[#c9a46a] bg-gradient-to-b from-[#6b4a2c] to-[#4b321e] shadow-inner opacity-70 flex items-center justify-center shrink-0"
        >
          <span className="text-[#ffd27a] text-xs font-black">+</span>
        </button>
      ))}
    </div>
  );
};
