import React, { useState } from 'react';
import { Sword, Heart, Shield, Activity, User, Sparkles, Crown, Shield as ShieldIcon, Zap, Target } from 'lucide-react';
import { useInventoryStore } from '../../store/inventoryStore';
import { useGameStore } from '../../store/gameStore';
import { useEvolutionStore } from '../../store/evolutionStore';
import { useClassStore, CLASSES } from '../../store/classStore';
import { formatNumber } from '../../lib/formatters';
import { StatType } from '../../lib/gameTypes';
import { EquipmentGrid } from './EquipmentGrid';
import { EvolutionPanel } from '../game/Evolution/EvolutionPanel';
import { ClassSelection } from '../game/Class/ClassSelection';

export const HeroTab: React.FC = () => {
  const { playerStats, currentHp } = useInventoryStore();
  const { playerLevel, playerExp, expToNextLevel } = useGameStore();
  const { getCurrentStage, getEvolutionBonuses } = useEvolutionStore();
  const { selectedClassId, getClassLevel } = useClassStore();
  
  const [showEvolution, setShowEvolution] = useState(false);
  const [showClassSelection, setShowClassSelection] = useState(false);

  const expPercent = playerExp.div(expToNextLevel).times(100).toNumber();
  const currentStage = getCurrentStage();
  const evolutionBonuses = getEvolutionBonuses();
  const classLevel = selectedClassId ? getClassLevel() : 0;

  const selectedClass = CLASSES.find(c => c.id === selectedClassId);

  const getClassIcon = () => {
    if (!selectedClassId) return <User size={16} />;
    switch (selectedClassId) {
      case 'warrior': return <ShieldIcon size={16} />;
      case 'mage': return <Zap size={16} />;
      case 'archer': return <Target size={16} />;
      default: return <User size={16} />;
    }
  };

  const StatRow = ({ label, value, icon: Icon, color, bonus }: { 
    label: string, 
    value: string, 
    icon: any, 
    color: string,
    bonus?: number 
  }) => (
    <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-gradient-to-b from-[#7f5a39] to-[#5a3d25] border-2 border-[#d2b07a] shadow-[0_4px_8px_rgba(0,0,0,0.25)]">
      <div className="flex items-center gap-2">
        <div className={`p-2 rounded-full ${color} text-white border-2 border-white/40 shadow-inner`}>
          <Icon size={16} />
        </div>
        <div>
          <span className="text-[#ffe9bf] font-bold text-[11px] uppercase tracking-wider">{label}</span>
          {bonus && bonus > 1 && (
            <span className="ml-2 text-[8px] text-[#ffd27a] font-bold">x{bonus.toFixed(1)}</span>
          )}
        </div>
      </div>
      <span className="font-black text-sm text-white drop-shadow">{value}</span>
    </div>
  );

  return (
    <div className="flex-1 overflow-y-auto bg-gradient-to-b from-[#f4e4c8] to-[#e0c49a] p-3 space-y-3">
      {/* Hero Profile Card */}
      <div className="rounded-2xl border-2 border-[#f0d08a] bg-gradient-to-b from-[#f7e7cc] to-[#d7b483] shadow-[0_8px_16px_rgba(0,0,0,0.25)] overflow-hidden">
        <div className="px-4 py-3 bg-gradient-to-b from-[#7f5a39] to-[#5a3d25] border-b-2 border-[#d2b07a] flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#ffe9bf]">
            {getClassIcon()}
            <span className="text-[11px] font-black uppercase tracking-wider">
              {selectedClass ? selectedClass.name : 'Hero Profile'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {selectedClass && classLevel > 0 && (
              <span className="text-[9px] bg-[#ffd27a] text-[#5a3d25] px-2 py-0.5 rounded-full font-black">
                Class Lv.{classLevel}
              </span>
            )}
            <span className="text-[10px] font-bold text-[#ffd27a]">Lv {playerLevel}</span>
          </div>
        </div>

        <div className="p-4">
          <div className="flex items-center gap-4">
            {/* Character Avatar */}
            <div className="relative">
              <div 
                className="w-20 h-20 rounded-full border-4 shadow-lg flex items-center justify-center text-3xl"
                style={{ 
                  borderColor: currentStage.color,
                  background: `linear-gradient(135deg, ${currentStage.color}44, ${currentStage.color}88)`,
                  boxShadow: `0 0 20px ${currentStage.color}40`,
                }}
              >
                {currentStage.icon}
              </div>
              {/* Evolution Badge */}
              <button
                onClick={() => setShowEvolution(true)}
                className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-gradient-to-b from-[#ffd27a] to-[#d49a47] border-2 border-[#fff2cc] flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
              >
                <Sparkles size={14} className="text-[#4a2f1a]" />
              </button>
            </div>

            {/* Character Info */}
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-xl font-black text-[#5a3d25]">{currentStage.name}</span>
                {selectedClass && (
                  <span 
                    className="text-[9px] px-2 py-0.5 rounded-full font-black text-white"
                    style={{ background: selectedClass.color }}
                  >
                    {selectedClass.name}
                  </span>
                )}
              </div>
              
              <div className="text-[11px] font-bold text-[#8a5a23]">
                Power: {formatNumber(playerStats[StatType.ATTACK])}
              </div>

              {/* Class Selection Button */}
              <button
                onClick={() => setShowClassSelection(true)}
                className="mt-2 px-3 py-1 rounded-lg text-[9px] font-black border-2 bg-gradient-to-b from-[#6b4a2c] to-[#4b321e] text-[#ffe9bf] border-[#c9a46a] hover:brightness-110 transition-all"
              >
                {selectedClassId ? 'Change Class' : 'Select Class'}
              </button>

              {/* XP Bar */}
              <div className="mt-2 w-full h-4 bg-[#4a3320] rounded-full overflow-hidden border-2 border-[#d2b07a] relative">
                <div
                  className="h-full bg-gradient-to-r from-[#7dd3fc] to-[#3b82f6] transition-all duration-500"
                  style={{ width: `${Math.min(100, expPercent)}%` }}
                />
                <div className="absolute inset-0 flex items-center justify-center text-[9px] font-black text-white drop-shadow">
                  {formatNumber(playerExp)} / {formatNumber(expToNextLevel)} XP
                </div>
              </div>
            </div>
          </div>

          {/* Evolution & Class Bonuses */}
          {(Object.keys(evolutionBonuses).length > 0 || selectedClass) && (
            <div className="mt-4 p-3 rounded-xl bg-[#5a3d25]/10 border border-[#d2b07a]">
              <div className="text-[10px] font-black text-[#5a3d25] uppercase tracking-wider mb-2 flex items-center gap-1">
                <Crown size={12} className="text-[#ffd27a]" />
                Active Bonuses
              </div>
              <div className="flex flex-wrap gap-2">
                {Object.entries(evolutionBonuses).map(([stat, value]) => (
                  <span key={stat} className="text-[9px] bg-[#ffd27a]/30 text-[#5a3d25] px-2 py-0.5 rounded-full font-bold border border-[#ffd27a]">
                    {stat}: x{value}
                  </span>
                ))}
                {selectedClass && (
                  <span 
                    className="text-[9px] text-white px-2 py-0.5 rounded-full font-bold"
                    style={{ background: selectedClass.color }}
                  >
                    {selectedClass.name} Class Active
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="rounded-2xl border-2 border-[#f0d08a] bg-gradient-to-b from-[#f7e7cc] to-[#d7b483] shadow-[0_6px_12px_rgba(0,0,0,0.2)] p-3 space-y-2">
        <div className="text-[11px] font-black uppercase tracking-wider text-[#5a3d25]">Stats</div>
        <StatRow
          label="Attack"
          value={formatNumber(playerStats[StatType.ATTACK])}
          icon={Sword}
          color="bg-red-500"
          bonus={evolutionBonuses.attack}
        />
        <StatRow
          label="HP"
          value={`${formatNumber(currentHp)} / ${formatNumber(playerStats[StatType.HP])}`}
          icon={Heart}
          color="bg-green-500"
          bonus={evolutionBonuses.hp}
        />
        <StatRow
          label="Defense"
          value={formatNumber(playerStats[StatType.DEFENSE])}
          icon={Shield}
          color="bg-blue-500"
          bonus={evolutionBonuses.defense}
        />
        <StatRow
          label="Speed"
          value={formatNumber(playerStats[StatType.SPEED])}
          icon={Activity}
          color="bg-yellow-500"
          bonus={evolutionBonuses.speed}
        />
      </div>

      {/* Equipment */}
      <div className="rounded-2xl border-2 border-[#f0d08a] bg-gradient-to-b from-[#f7e7cc] to-[#d7b483] shadow-[0_6px_12px_rgba(0,0,0,0.2)] p-2">
        <div className="px-2 py-1 text-[11px] font-black uppercase tracking-wider text-[#5a3d25]">Equipment</div>
        <EquipmentGrid />
      </div>

      {/* Evolution Modal */}
      {showEvolution && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-[440px] mx-4">
            <EvolutionPanel onClose={() => setShowEvolution(false)} />
          </div>
        </div>
      )}

      {/* Class Selection Modal */}
      {showClassSelection && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-[440px] mx-4">
            <ClassSelection onClose={() => setShowClassSelection(false)} />
          </div>
        </div>
      )}
    </div>
  );
};
