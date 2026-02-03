import React from 'react';
import { Sword, Heart, Shield, Activity, User } from 'lucide-react';
import { useInventoryStore } from '../../store/inventoryStore';
import { useGameStore } from '../../store/gameStore';
import { formatNumber } from '../../lib/formatters';
import { StatType } from '../../lib/gameTypes';
import { EquipmentGrid } from './EquipmentGrid';

export const HeroTab: React.FC = () => {
  const { playerStats, currentHp } = useInventoryStore();
  const { playerLevel, playerExp, expToNextLevel } = useGameStore();

  const expPercent = playerExp.div(expToNextLevel).times(100).toNumber();

  const StatRow = ({ label, value, icon: Icon, color }: { label: string, value: string, icon: any, color: string }) => (
    <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-gradient-to-b from-[#7f5a39] to-[#5a3d25] border-2 border-[#d2b07a] shadow-[0_4px_8px_rgba(0,0,0,0.25)]">
      <div className="flex items-center gap-2">
        <div className={`p-2 rounded-full ${color} text-white border-2 border-white/40 shadow-inner`}>
          <Icon size={16} />
        </div>
        <span className="text-[#ffe9bf] font-bold text-[11px] uppercase tracking-wider">{label}</span>
      </div>
      <span className="font-black text-sm text-white drop-shadow">{value}</span>
    </div>
  );

  return (
    <div className="flex-1 overflow-y-auto bg-gradient-to-b from-[#f4e4c8] to-[#e0c49a] p-3 space-y-3">
      <div className="rounded-2xl border-2 border-[#f0d08a] bg-gradient-to-b from-[#f7e7cc] to-[#d7b483] shadow-[0_8px_16px_rgba(0,0,0,0.25)] overflow-hidden">
        <div className="px-4 py-3 bg-gradient-to-b from-[#7f5a39] to-[#5a3d25] border-b-2 border-[#d2b07a] flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#ffe9bf]">
            <User size={16} />
            <span className="text-[11px] font-black uppercase tracking-wider">Hero Profile</span>
          </div>
          <div className="text-[10px] font-bold text-[#ffd27a]">Lv {playerLevel}</div>
        </div>

        <div className="p-4 flex items-center gap-4">
          <div className="w-20 h-20 rounded-full border-4 border-[#f0d08a] bg-gradient-to-br from-[#7fd18a] to-[#2f8f5a] shadow-lg flex items-center justify-center text-3xl">
            🧙‍♂️
          </div>
          <div className="flex-1">
            <div className="text-xl font-black text-[#5a3d25]">Hero</div>
            <div className="text-[11px] font-bold text-[#8a5a23]">Power: {formatNumber(playerStats[StatType.ATTACK])}</div>

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
      </div>

      <div className="rounded-2xl border-2 border-[#f0d08a] bg-gradient-to-b from-[#f7e7cc] to-[#d7b483] shadow-[0_6px_12px_rgba(0,0,0,0.2)] p-3 space-y-2">
        <div className="text-[11px] font-black uppercase tracking-wider text-[#5a3d25]">Stats</div>
        <StatRow
          label="Attack"
          value={formatNumber(playerStats[StatType.ATTACK])}
          icon={Sword}
          color="bg-red-500"
        />
        <StatRow
          label="HP"
          value={`${formatNumber(currentHp)} / ${formatNumber(playerStats[StatType.HP])}`}
          icon={Heart}
          color="bg-green-500"
        />
        <StatRow
          label="Defense"
          value={formatNumber(playerStats[StatType.DEFENSE])}
          icon={Shield}
          color="bg-blue-500"
        />
        <StatRow
          label="Speed"
          value={formatNumber(playerStats[StatType.SPEED])}
          icon={Activity}
          color="bg-yellow-500"
        />
      </div>

      <div className="rounded-2xl border-2 border-[#f0d08a] bg-gradient-to-b from-[#f7e7cc] to-[#d7b483] shadow-[0_6px_12px_rgba(0,0,0,0.2)] p-2">
        <div className="px-2 py-1 text-[11px] font-black uppercase tracking-wider text-[#5a3d25]">Equipment</div>
        <EquipmentGrid />
      </div>
    </div>
  );
};
