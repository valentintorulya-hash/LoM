import React from 'react';
import { Sparkles, TrendingUp } from 'lucide-react';
import type { Item } from '../../../lib/gameTypes';
import { formatNumber } from '../../../lib/formatters';
import { RARITY_CONFIG } from '../../../lib/constants';

interface LootToastProps {
  item: Item;
  onEquip: () => void;
  onSell: () => void;
}

const getSlotIcon = (slot: string) => {
  switch (slot) {
    case 'Weapon':
      return '⚔️';
    case 'Helmet':
      return '🛡️';
    case 'Armor':
      return '🎽';
    case 'Boots':
      return '👢';
    case 'Gloves':
      return '🧤';
    case 'Pants':
      return '👖';
    case 'Ring':
    case 'Ring1':
    case 'Ring2':
      return '💍';
    case 'Amulet':
      return '📿';
    case 'Bracelet':
      return '📿';
    case 'Belt':
      return '🎀';
    case 'Cape':
      return '🧥';
    default:
      return '✨';
  }
};

export const LootToast: React.FC<LootToastProps> = ({ item, onEquip, onSell }) => {
  const config = RARITY_CONFIG[item.rarity];

  return (
    <div className="pointer-events-auto w-[240px] rounded-2xl border-2 bg-gradient-to-b from-[#f7e7cc] to-[#d7b483] shadow-[0_8px_18px_rgba(0,0,0,0.3)] overflow-hidden animate-in slide-in-from-right-2 fade-in duration-300">
      <div className="px-3 py-2 bg-gradient-to-b from-[#7f5a39] to-[#5a3d25] border-b-2 border-[#d2b07a] flex items-center justify-between">
        <div className="flex items-center gap-2 text-[#ffe9bf]">
          <Sparkles size={12} className="text-[#ffd27a]" />
          <span className="text-[10px] font-black uppercase tracking-wider">New Loot</span>
        </div>
        <span className="text-[9px] font-black text-[#5a3d25] bg-[#ffd27a] px-2 py-0.5 rounded-full border-2 border-[#f0d08a]">
          {item.rarity}
        </span>
      </div>

      <div className="p-3 flex items-center gap-3">
        <div className={`w-12 h-12 rounded-xl border-2 ${config.borderColor} bg-gradient-to-b from-[#fff3d4] to-[#e2b479] shadow-inner flex items-center justify-center text-2xl`}>
          {getSlotIcon(item.slot)}
        </div>
        <div className="flex-1">
          <div className={`text-sm font-black ${config.color} leading-tight`}>{item.name}</div>
          <div className="flex items-center gap-1 text-[10px] text-[#6a5a44]">
            <TrendingUp size={10} className="text-[#7dd3fc]" />
            <span>{item.mainStat.type} +{formatNumber(item.mainStat.value)}</span>
          </div>
          <div className="text-[9px] text-[#8a5a23] font-bold">Slot: {item.slot}</div>
        </div>
      </div>

      <div className="px-3 pb-3 grid grid-cols-2 gap-2">
        <button
          onClick={onSell}
          className="py-1.5 rounded-lg bg-gradient-to-b from-[#d46b57] to-[#a9422f] border-2 border-[#ffb4a6] text-white text-[10px] font-black"
        >
          Sell
        </button>
        <button
          onClick={onEquip}
          className="py-1.5 rounded-lg bg-gradient-to-b from-[#6ee7a8] to-[#2f8f5a] border-2 border-[#b7f0d3] text-[#0f3d2b] text-[10px] font-black"
        >
          Equip
        </button>
      </div>
    </div>
  );
};
