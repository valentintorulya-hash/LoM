import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';
import { useInventoryStore } from '../../store/inventoryStore';
import { useLampController } from './Lamp/useLampController';
import { ParticleEffect } from '../ui/ParticleEffect';
import { ShimmerButton } from '../ui/shimmer-button';

interface GenieLampButtonProps {
  onClick?: () => void;
  className?: string;
  label?: string;
  disabled?: boolean;
}

const GenieLampButton: React.FC<GenieLampButtonProps> = ({
  onClick,
  className = '',
  label = '',
  disabled = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  return (
    <button
      onClick={disabled ? undefined : onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsPressed(false);
      }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      className={`group relative transition-all duration-300 ${isPressed ? 'scale-95' : isHovered ? 'scale-105' : 'scale-100'} ${disabled ? 'opacity-60 grayscale cursor-not-allowed' : ''} ${className}`}
      aria-label={label}
      aria-disabled={disabled}
    >
      <div
        className={`absolute inset-0 rounded-full blur-xl transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-60'}`}
        style={{
          background: 'radial-gradient(circle, rgba(251, 191, 36, 0.4) 0%, rgba(217, 119, 6, 0.2) 50%, transparent 70%)',
          transform: 'scale(1.5)'
        }}
      />

      <svg
        width="160"
        height="170"
        viewBox="0 0 120 140"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10 drop-shadow-2xl"
      >
        <ellipse cx="60" cy="130" rx="20" ry="6" fill="url(#goldGradient)" />
        <rect x="55" y="120" width="10" height="10" fill="url(#goldDark)" rx="1" />
        
        <path
          d="M 45 120 Q 40 100 42 80 Q 43 60 50 50 L 70 50 Q 77 60 78 80 Q 80 100 75 120 Z"
          fill="url(#goldGradient)"
          stroke="url(#goldStroke)"
          strokeWidth="1.5"
        />
        
        <path
          d="M 48 115 Q 46 95 48 75 Q 49 60 52 52"
          fill="none"
          stroke="rgba(255, 255, 255, 0.6)"
          strokeWidth="2"
          strokeLinecap="round"
          className={`transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-70'}`}
        />
        
        <ellipse cx="60" cy="85" rx="18" ry="4" fill="url(#goldDark)" opacity="0.8" />
        <ellipse cx="60" cy="70" rx="16" ry="3" fill="url(#goldDark)" opacity="0.6" />
        
        <path
          d="M 70 65 Q 85 60 95 55 Q 98 54 100 56 Q 102 58 100 60 Q 95 65 85 68 Q 75 70 72 68 Z"
          fill="url(#goldGradient)"
          stroke="url(#goldStroke)"
          strokeWidth="1"
        />
        
        <path
          d="M 72 66 Q 82 62 92 57"
          fill="none"
          stroke="rgba(255, 255, 255, 0.5)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        
        <path
          d="M 42 90 Q 30 90 25 85 Q 22 82 22 78 Q 22 74 25 71 Q 30 66 42 66"
          fill="none"
          stroke="url(#goldGradient)"
          strokeWidth="4"
          strokeLinecap="round"
        />
        
        <path
          d="M 42 88 Q 32 88 27 83 Q 25 81 25 78 Q 25 75 27 73 Q 32 68 42 68"
          fill="none"
          stroke="url(#goldDark)"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.6"
        />
        
        <path
          d="M 42 70 Q 34 70 29 74"
          fill="none"
          stroke="rgba(255, 255, 255, 0.7)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        
        <ellipse cx="60" cy="50" rx="22" ry="5" fill="url(#goldDark)" />
        
        <path
          d="M 38 50 Q 38 45 42 42 L 78 42 Q 82 45 82 50 Z"
          fill="url(#goldGradient)"
          stroke="url(#goldStroke)"
          strokeWidth="1"
        />
        
        <ellipse cx="60" cy="42" rx="6" ry="4" fill="url(#goldGradient)" />
        <ellipse cx="60" cy="38" rx="4" ry="3" fill="url(#goldDark)" />
        
        <path
          d="M 42 48 Q 42 46 44 44 L 76 44"
          fill="none"
          stroke="rgba(255, 255, 255, 0.6)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        
        <g className={`transition-all duration-500 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
          <circle cx="60" cy="30" r="3" fill="#fbbf24" opacity="0.8">
            <animate attributeName="r" values="3;5;3" dur="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.8;1;0.8" dur="2s" repeatCount="indefinite" />
          </circle>
          <path d="M 60 25 L 60 35 M 55 30 L 65 30" stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
        </g>
        
        <defs>
          <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="50%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>
          
          <linearGradient id="goldDark" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#d97706" />
            <stop offset="50%" stopColor="#b45309" />
            <stop offset="100%" stopColor="#92400e" />
          </linearGradient>
          
          <linearGradient id="goldStroke" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#b45309" />
          </linearGradient>
        </defs>
      </svg>

      {label && (
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
          <span className="text-sm font-medium text-foreground/80 group-hover:text-foreground transition-colors duration-300 flex items-center gap-1.5">
            {label}
            <Sparkles size={14} className={`transition-all duration-300 ${isHovered ? 'opacity-100 rotate-12' : 'opacity-60 rotate-0'}`} />
          </span>
        </div>
      )}

      <div
        className={`absolute inset-0 rounded-full transition-all duration-700 ${isHovered ? 'opacity-100 scale-150' : 'opacity-0 scale-100'}`}
        style={{
          background: 'radial-gradient(circle, transparent 40%, rgba(251, 191, 36, 0.1) 70%, transparent 100%)',
          animation: isHovered ? 'pulse 2s ease-in-out infinite' : 'none'
        }}
      />
    </button>
  );
};

export const LampAction: React.FC = () => {
  const { currencies, lamp } = useGameStore();
  const { currentItem, lootQueue } = useInventoryStore();
  const { rubLamp, rubLampBatch, isAutoMode, autoBatch, setAutoBatch, toggleAutoMode } = useLampController();
  const [showParticleEffect, setShowParticleEffect] = useState(false);

  const canAfford = currencies.lamps.gte(1);
  const canAffordTen = currencies.lamps.gte(10);
  const hasPending = !!currentItem || lootQueue.length > 0;
  const progressPercent = (lamp.progress / lamp.toNextLevel) * 100;
  const summonEnabled = canAfford && !isAutoMode && !hasPending;
  const summonTenEnabled = canAffordTen && !isAutoMode && !hasPending;

  const triggerEffects = () => {
    setShowParticleEffect(true);
  };

  const handleSummon = () => {
    if (!canAfford || isAutoMode || hasPending) return;
    triggerEffects();
    rubLamp();
  };

  const handleSummonTen = () => {
    if (!canAffordTen || isAutoMode || hasPending) return;
    triggerEffects();
    rubLampBatch(10, 'manual');
  };

  return (
    <div className="flex flex-col items-center justify-center w-full relative py-2">
      <div className="absolute -top-7 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-[#f0d08a]/40 shadow-lg whitespace-nowrap">
        <span className="text-[10px] text-[#ffe6b0] font-bold uppercase">Lamp Lv {lamp.level}</span>
        <div className="w-20 h-1.5 bg-black/40 rounded-full overflow-hidden border border-[#c9a46a]/50">
          <div
            className="h-full bg-gradient-to-r from-[#f0d08a] to-[#d49a47] relative"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <span className="text-[9px] text-white font-bold">{lamp.progress}/{lamp.toNextLevel}</span>
      </div>

      <div className="relative">
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-48 h-28 bg-[#ffd27a]/25 blur-2xl rounded-full pointer-events-none" />

        {showParticleEffect && (
          <ParticleEffect
            x={80}
            y={70}
            count={24}
            colors={['#FFD700', '#FFA500']}
            emoji="✨"
            duration={1000}
            onComplete={() => setShowParticleEffect(false)}
          />
        )}

        <GenieLampButton
          onClick={handleSummon}
          disabled={!canAfford || isAutoMode || hasPending}
          className="-mt-4"
          label=""
        />
      </div>

      <div className="flex items-center gap-2 mt-2">
        <ShimmerButton
          onClick={handleSummon}
          disabled={!summonEnabled}
          shimmerColor="#dbeafe"
          shimmerDuration="2.2s"
          borderRadius="12px"
          background={summonEnabled ? 'linear-gradient(to bottom, #4da1ff, #2c6fd8)' : '#4b5563'}
          className={`px-4 py-2 rounded-xl font-black text-[11px] shadow-md transition-all flex items-center gap-1.5 border-2 ${
            summonEnabled ? 'border-[#b5d9ff] text-white' : 'border-gray-600 text-gray-300'
          }`}
        >
          <span>Summon</span>
          <div className="flex items-center bg-black/20 px-1.5 rounded">
            <span className="text-[9px]">💡</span>
            <span>1</span>
          </div>
        </ShimmerButton>

        <ShimmerButton
          onClick={handleSummonTen}
          disabled={!summonTenEnabled}
          shimmerColor="#fff1cc"
          shimmerDuration="2.6s"
          borderRadius="12px"
          background={summonTenEnabled ? 'linear-gradient(to bottom, #ffd27a, #d49a47)' : '#4b5563'}
          className={`px-4 py-2 rounded-xl font-black text-[11px] shadow-md transition-all flex items-center gap-1.5 border-2 ${
            summonTenEnabled ? 'border-[#fff2cc] text-[#4a2f1a]' : 'border-gray-600 text-gray-300'
          }`}
        >
          <span>x10</span>
          <div className="flex items-center bg-black/20 px-1.5 rounded">
            <span className="text-[9px]">💡</span>
            <span>10</span>
          </div>
        </ShimmerButton>

        <button
          onClick={toggleAutoMode}
          className={`px-3 py-2 rounded-xl font-black text-[11px] shadow-md transition-all flex items-center gap-1.5 border-2
            ${isAutoMode
              ? 'bg-gradient-to-b from-[#6ee7a8] to-[#2f8f5a] text-[#0f3d2b] border-[#b7f0d3]'
              : 'bg-gradient-to-b from-[#6b4a2c] to-[#4b321e] text-[#ffe9bf] border-[#c9a46a]'
            }
          `}
        >
          <Sparkles size={14} />
          <span>{isAutoMode ? 'AUTO ON' : 'AUTO'}</span>
        </button>
      </div>

      <div className="mt-2 flex items-center gap-2">
        <button
          onClick={() => setAutoBatch(1)}
          className={`px-3 py-1 rounded-lg text-[10px] font-black border-2 transition-all
            ${autoBatch === 1
              ? 'bg-gradient-to-b from-[#ffd27a] to-[#d49a47] text-[#4a2f1a] border-[#fff2cc]'
              : 'bg-gradient-to-b from-[#6b4a2c] to-[#4b321e] text-[#ffe9bf] border-[#c9a46a]'
            }
          `}
        >
          AUTO x1
        </button>
        <button
          onClick={() => setAutoBatch(10)}
          className={`px-3 py-1 rounded-lg text-[10px] font-black border-2 transition-all
            ${autoBatch === 10
              ? 'bg-gradient-to-b from-[#ffd27a] to-[#d49a47] text-[#4a2f1a] border-[#fff2cc]'
              : 'bg-gradient-to-b from-[#6b4a2c] to-[#4b321e] text-[#ffe9bf] border-[#c9a46a]'
            }
          `}
        >
          AUTO x10
        </button>
      </div>

      {isAutoMode && (
        <div className="absolute -right-16 top-1/2 -translate-y-1/2 text-[9px] text-[#ffd27a] bg-black/60 px-2 py-0.5 rounded border border-[#f0d08a]/40 animate-pulse">
          AUTO
        </div>
      )}
    </div>
  );
};
