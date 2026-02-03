import React, { useEffect, useState } from 'react';
import { Clock, Lock, Play, Trophy, Zap, SkipForward, X, Swords } from 'lucide-react';
import { useDungeonStore, DUNGEONS } from '../../../store/dungeonStore';
import { useGameStore } from '../../../store/gameStore';
import { useCombatStore } from '../../../store/combatStore';
import { formatNumber } from '../../../lib/formatters';
import { OverlayPanel } from '../../layout/OverlayPanel';

interface DungeonPanelProps {
  onClose: () => void;
}

export const DungeonPanel: React.FC<DungeonPanelProps> = ({ onClose }) => {
  const dungeonStore = useDungeonStore();
  const { 
    enterDungeon, 
    getCooldownRemaining, 
    getCooldownPercent, 
    skipCooldown,
    getAttempt,
    towerHighestFloor,
  } = dungeonStore;
  
  const { playerLevel, currencies } = useGameStore();
  const { stage: combatStage } = useCombatStore();
  const [selectedDungeon, setSelectedDungeon] = useState<string | null>(null);
  const [, setNow] = useState(Date.now());

  // Update timer every second
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (ms: number) => {
    if (ms <= 0) return 'Ready!';
    const hours = Math.floor(ms / (60 * 60 * 1000));
    const minutes = Math.floor((ms % (60 * 60 * 1000)) / (60 * 1000));
    const seconds = Math.floor((ms % (60 * 1000)) / 1000);
    
    if (hours > 0) return `${hours}h ${minutes}m`;
    if (minutes > 0) return `${minutes}m ${seconds}s`;
    return `${seconds}s`;
  };

  const handleEnterDungeon = (dungeonId: string) => {
    if (enterDungeon(dungeonId as any)) {
      setSelectedDungeon(dungeonId);
    }
  };

  const handleSkipCooldown = (dungeonId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    skipCooldown(dungeonId as any);
  };

  const getDifficultyColor = (reqLevel: number) => {
    if (playerLevel >= reqLevel + 20) return 'text-green-500';
    if (playerLevel >= reqLevel) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <OverlayPanel title="Dungeons" onClose={onClose}>
      <div className="space-y-3">
        {/* Tower Record */}
        <div className="rounded-2xl border-2 border-[#9B59B6] bg-gradient-to-b from-[#9B59B6]/20 to-[#9B59B6]/10 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy size={20} className="text-[#9B59B6]" />
              <div>
                <div className="text-[10px] font-black text-[#5a3d25] uppercase">Tower Record</div>
                <div className="text-lg font-black text-[#9B59B6]">Floor {towerHighestFloor}</div>
              </div>
            </div>
            <div className="text-2xl">🏰</div>
          </div>
        </div>

        {/* Dungeon List */}
        <div className="space-y-3">
          {DUNGEONS.map((dungeon) => {
            const isUnlocked = playerLevel >= dungeon.reqLevel && combatStage >= dungeon.reqStage;
            const cooldownRemaining = getCooldownRemaining(dungeon.id as any);
            const cooldownPercent = getCooldownPercent(dungeon.id as any);
            const attempt = getAttempt(dungeon.id as any);
            const isActive = dungeonStore.isDungeonActive(dungeon.id as any);
            const hoursRemaining = Math.ceil(cooldownRemaining / (60 * 60 * 1000));
            const skipCost = Math.max(5, hoursRemaining);

            return (
              <div 
                key={dungeon.id}
                className={`
                  rounded-2xl border-2 p-4 transition-all
                  ${isActive 
                    ? 'border-[#6ee7a8] bg-gradient-to-b from-[#6ee7a8]/20 to-[#2f8f5a]/10' 
                    : 'border-[#d2b07a] bg-gradient-to-b from-[#f9e8cc] to-[#d7b483]'
                  }
                  ${!isUnlocked ? 'opacity-60' : 'hover:shadow-lg'}
                `}
              >
                <div className="flex items-start gap-3">
                  {/* Dungeon Icon */}
                  <div 
                    className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl border-2"
                    style={{ 
                      background: `${dungeon.color}30`,
                      borderColor: isUnlocked ? dungeon.color : '#999',
                    }}
                  >
                    {isUnlocked ? dungeon.icon : <Lock size={20} className="text-gray-400" />}
                  </div>

                  {/* Dungeon Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-black text-[#5a3d25] text-base">{dungeon.name}</h3>
                      {isActive && (
                        <span className="text-[8px] bg-[#6ee7a8] text-[#0f3d2b] px-2 py-0.5 rounded-full font-black">
                          IN PROGRESS
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-[#6a5a44] mt-1">{dungeon.description}</p>

                    {/* Requirements */}
                    <div className="flex items-center gap-3 mt-2 text-[9px]">
                      <span className={getDifficultyColor(dungeon.reqLevel)}>
                        Lv.{dungeon.reqLevel}
                      </span>
                      <span className="text-[#6a5a44]">•</span>
                      <span className={combatStage >= dungeon.reqStage ? 'text-green-500' : 'text-red-500'}>
                        Stage {dungeon.reqStage}
                      </span>
                      <span className="text-[#6a5a44]">•</span>
                      <span className="text-[#6a5a44]">
                        {dungeon.waves === Infinity ? '∞ Waves' : `${dungeon.waves} Waves`}
                      </span>
                    </div>

                    {/* Rewards Preview */}
                    <div className="flex flex-wrap gap-2 mt-2">
                      {dungeon.rewards.gold.gt(0) && (
                        <span className="text-[8px] bg-[#ffd27a]/30 text-[#5a3d25] px-1.5 py-0.5 rounded font-bold">
                          +{formatNumber(dungeon.rewards.gold)} 💰
                        </span>
                      )}
                      {dungeon.rewards.diamonds.gt(0) && (
                        <span className="text-[8px] bg-[#6fb6ff]/30 text-[#5a3d25] px-1.5 py-0.5 rounded font-bold">
                          +{formatNumber(dungeon.rewards.diamonds)} 💎
                        </span>
                      )}
                      {dungeon.rewards.lamps.gt(0) && (
                        <span className="text-[8px] bg-[#f0d08a]/30 text-[#5a3d25] px-1.5 py-0.5 rounded font-bold">
                          +{formatNumber(dungeon.rewards.lamps)} 💡
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Area */}
                <div className="mt-3">
                  {!isUnlocked ? (
                    <div className="flex items-center justify-center gap-2 text-[10px] text-gray-500 py-2 bg-black/5 rounded-xl">
                      <Lock size={14} />
                      <span>Unlock at Lv.{dungeon.reqLevel}, Stage {dungeon.reqStage}</span>
                    </div>
                  ) : isActive ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedDungeon(dungeon.id)}
                        className="flex-1 py-2 rounded-xl font-black text-[10px] border-2 bg-gradient-to-b from-[#6ee7a8] to-[#2f8f5a] text-[#0f3d2b] border-[#b7f0d3] flex items-center justify-center gap-1"
                      >
                        <Swords size={14} />
                        Continue (Wave {attempt?.currentWave})
                      </button>
                    </div>
                  ) : cooldownRemaining > 0 ? (
                    <div className="space-y-2">
                      {/* Cooldown Bar */}
                      <div className="relative h-2 bg-[#4a3320]/20 rounded-full overflow-hidden">
                        <div 
                          className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#ffd27a] to-[#d49a47] transition-all"
                          style={{ width: `${cooldownPercent}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-[10px] text-[#6a5a44]">
                          <Clock size={12} />
                          <span>{formatTime(cooldownRemaining)}</span>
                        </div>
                        <button
                          onClick={(e) => handleSkipCooldown(dungeon.id, e)}
                          disabled={currencies.diamonds.lt(skipCost)}
                          className="flex items-center gap-1 text-[9px] font-bold text-[#6fb6ff] hover:text-[#3b76d6] disabled:text-gray-400"
                        >
                          <SkipForward size={12} />
                          Skip ({skipCost} 💎)
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleEnterDungeon(dungeon.id)}
                      className="w-full py-2 rounded-xl font-black text-[10px] border-2 bg-gradient-to-b from-[#ffd27a] to-[#d49a47] text-[#4a2f1a] border-[#fff2cc] flex items-center justify-center gap-1 hover:brightness-110 active:scale-95 transition-all"
                    >
                      <Play size={14} />
                      Enter Dungeon
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Dungeon Info */}
        <div className="rounded-xl bg-[#5a3d25]/10 border border-[#d2b07a] p-3">
          <div className="flex items-start gap-2">
            <Zap size={14} className="text-[#ffd27a] mt-0.5" />
            <p className="text-[9px] text-[#6a5a44]">
              Dungeons provide massive rewards but have cooldowns. Complete all waves to claim your prize!
              The Endless Tower has no cooldown but gets progressively harder.
            </p>
          </div>
        </div>
      </div>

      {/* Active Dungeon Modal would go here */}
      {selectedDungeon && (
        <DungeonBattleModal 
          dungeonId={selectedDungeon} 
          onClose={() => setSelectedDungeon(null)} 
        />
      )}
    </OverlayPanel>
  );
};

// Simple placeholder for dungeon battle modal
const DungeonBattleModal: React.FC<{ dungeonId: string; onClose: () => void }> = ({ dungeonId, onClose }) => {
  const dungeon = DUNGEONS.find(d => d.id === dungeonId);
  const { completeWave, failDungeon, claimRewards, getAttempt } = useDungeonStore();
  const attempt = getAttempt(dungeonId as any);
  
  if (!dungeon) return null;

  const handleWin = () => {
    completeWave(dungeonId as any, attempt?.currentWave || 1);
    if (dungeon.waves !== Infinity && (attempt?.currentWave || 1) >= dungeon.waves) {
      claimRewards(dungeonId as any);
      onClose();
    }
  };

  const handleLose = () => {
    failDungeon(dungeonId as any);
    claimRewards(dungeonId as any);
    onClose();
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-gradient-to-b from-[#f7e7cc] to-[#d7b483] rounded-2xl border-2 border-[#f0d08a] p-6 max-w-sm w-full mx-4">
        <div className="text-center">
          <div className="text-4xl mb-2">{dungeon.icon}</div>
          <h3 className="text-lg font-black text-[#5a3d25]">{dungeon.name}</h3>
          <p className="text-[10px] text-[#6a5a44] mt-1">Wave {attempt?.currentWave || 1}</p>
        </div>

        <div className="mt-6 space-y-3">
          <button
            onClick={handleWin}
            className="w-full py-3 rounded-xl font-black text-sm border-2 bg-gradient-to-b from-[#6ee7a8] to-[#2f8f5a] text-[#0f3d2b] border-[#b7f0d3] flex items-center justify-center gap-2"
          >
            <Trophy size={16} />
            Win Wave
          </button>
          <button
            onClick={handleLose}
            className="w-full py-3 rounded-xl font-black text-sm border-2 bg-gradient-to-b from-[#d46b57] to-[#a9422f] text-white border-[#ffb4a6] flex items-center justify-center gap-2"
          >
            <X size={16} />
            Give Up
          </button>
          <button
            onClick={onClose}
            className="w-full py-2 rounded-xl font-black text-xs text-[#6a5a44]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
