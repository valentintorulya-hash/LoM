import React, { useState } from 'react';
import { Sword, Shirt, Footprints, Gem, Cross, Hand, Accessibility, Watch, Shield, TrendingUp, Lock } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { useInventoryStore } from '../../store/inventoryStore';
import { ItemSlot, ItemRarity } from '../../lib/gameTypes';
import { formatNumber } from '../../lib/formatters';
import { RARITY_CONFIG } from '../../lib/constants';
import { RarityStars } from '../ui/RarityStars';

const rarityColors: Record<ItemRarity, string> = {
  'Common': 'bg-gradient-to-br from-[#b8b8b8] to-[#8c8c8c] border-[#5f5f5f]',
  'Uncommon': 'bg-gradient-to-br from-[#8fe3a5] to-[#3aa66c] border-[#1f6a43]',
  'Rare': 'bg-gradient-to-br from-[#8fc7ff] to-[#3c74d8] border-[#214a8c]',
  'Epic': 'bg-gradient-to-br from-[#c7a3ff] to-[#7a3bd8] border-[#4c1f8c]',
  'Legendary': 'bg-gradient-to-br from-[#ffd87a] to-[#f39b2b] border-[#8a5a23]',
  'Mythic': 'bg-gradient-to-br from-[#ff9b9b] to-[#d13232] border-[#7a1b1b] shadow-[0_0_10px_rgba(255,80,80,0.5)]',
};

export const EquipmentGrid: React.FC = () => {
  const { equipped, currentItem } = useInventoryStore();
  const [selectedSlot, setSelectedSlot] = useState<ItemSlot | null>(null);

  const slots = [
    { id: ItemSlot.WEAPON, icon: <Sword size={18} />, label: 'Weapon' },
    { id: ItemSlot.HELMET, icon: <Shield size={18} />, label: 'Helmet' },
    { id: ItemSlot.ARMOR, icon: <Shirt size={18} />, label: 'Armor' },
    { id: ItemSlot.GLOVES, icon: <Hand size={18} />, label: 'Gloves' },
    { id: ItemSlot.BOOTS, icon: <Footprints size={18} />, label: 'Boots' },
    { id: ItemSlot.PANTS, icon: <Accessibility size={18} />, label: 'Pants' },
    { id: ItemSlot.RING1, icon: <Gem size={18} />, label: 'Ring' },
    { id: ItemSlot.RING2, icon: <Gem size={18} />, label: 'Ring' },
    { id: ItemSlot.AMULET, icon: <Cross size={18} />, label: 'Amulet' },
    { id: ItemSlot.BRACELET, icon: <Watch size={18} />, label: 'Bracelet' },
    { id: ItemSlot.BELT, icon: <div className="font-bold text-[10px]">BELT</div>, label: 'Belt' },
    { id: ItemSlot.CAPE, icon: <div className="font-bold text-[10px]">CAPE</div>, label: 'Cape' },
  ];

  return (
    <div className="px-2 pb-2">
      <div className="rounded-2xl p-2 bg-gradient-to-b from-[#d7c2a0] to-[#b89366] border-2 border-[#f1d8a6] shadow-[0_6px_14px_rgba(0,0,0,0.25)]">
        <div className="flex items-center justify-between px-2 py-1.5 rounded-xl bg-gradient-to-b from-[#7f5a39] to-[#5a3d25] border-2 border-[#d2b07a] shadow-inner">
          <div className="text-[11px] font-black uppercase tracking-wider text-[#ffe9bf]">Equipment</div>
          <div className="text-[10px] font-bold text-[#ffe9bf]/80">Slots</div>
        </div>

        <div className="mt-2 relative rounded-xl bg-gradient-to-b from-[#ead7b7] to-[#d1b186] border border-[#a98256] p-2 shadow-inner">
          <div className="absolute top-2 left-2 w-2.5 h-2.5 rounded-full bg-[#5a3d25] border border-[#d2b07a] shadow-sm" />
          <div className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-[#5a3d25] border border-[#d2b07a] shadow-sm" />
          <div className="absolute bottom-2 left-2 w-2.5 h-2.5 rounded-full bg-[#5a3d25] border border-[#d2b07a] shadow-sm" />
          <div className="absolute bottom-2 right-2 w-2.5 h-2.5 rounded-full bg-[#5a3d25] border border-[#d2b07a] shadow-sm" />

          <div className="grid grid-cols-6 gap-1.5">
            {slots.map((slot) => {
              const item = equipped[slot.id];
              const isSelected = selectedSlot === slot.id;
              const isHighlighted = currentItem?.slot === slot.id;

              const tooltipContent = item ? (
                <div className="space-y-2 min-w-[180px]">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className={`font-bold text-sm ${RARITY_CONFIG[item.rarity]?.color}`}>
                        {item.rarity}
                      </span>
                      <RarityStars rarity={item.rarity} size={10} />
                    </div>
                    <span className="text-[10px] text-gray-400">Lv.{item.level}</span>
                  </div>

                  <h4 className="text-white font-bold text-xs leading-tight">{item.name}</h4>

                  <div className="flex items-center justify-between bg-black/30 rounded px-2 py-1.5 border border-white/10">
                    <div className="flex items-center gap-1">
                      <TrendingUp size={12} className="text-green-400" />
                      <span className="text-[10px] text-gray-300 uppercase">{item.mainStat.type}</span>
                    </div>
                    <span className="text-sm font-black text-green-400">
                      {formatNumber(item.mainStat.value)}
                    </span>
                  </div>

                  <div className="flex justify-between text-[10px] text-gray-400 pt-1 border-t border-white/10">
                    <span>Sell:</span>
                    <span className="text-yellow-400 font-bold">{formatNumber(item.sellPrice)} Gold</span>
                  </div>
                </div>
              ) : (
                <div className="text-center text-xs text-gray-400">
                  {slot.label} Slot<br />
                  <span className="text-[10px]">Empty</span>
                </div>
              );

              return (
                <Tooltip key={slot.id}>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => setSelectedSlot(slot.id)}
                      className={`relative aspect-square rounded-lg transition-all active:scale-95
                        ${isSelected ? 'ring-2 ring-[#f0d08a] scale-105' : ''}
                        ${isHighlighted ? 'ring-2 ring-[#ffd27a] shadow-[0_0_12px_rgba(255,210,122,0.6)]' : ''}
                      `}
                    >
                      <div
                        className={`w-full h-full rounded-lg border-2 flex items-center justify-center shadow-sm relative overflow-hidden transition-all
                          ${item ? rarityColors[item.rarity] : 'bg-[#f7e7cc] border-[#c9a46a] text-[#8c7e6a] hover:bg-[#edd8b6]'}
                        `}
                      >
                        {isHighlighted && (
                          <div className="absolute inset-0 rounded-lg bg-[radial-gradient(circle_at_50%_50%,#fff2cc88,transparent_55%)] animate-pulse" />
                        )}
                        {!item && (
                          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,#ffffff55,transparent_45%)] opacity-60" />
                        )}

                        {!item && (
                          <div className="flex flex-col items-center gap-1 text-[#7a6a54]">
                            <Lock size={14} className="opacity-70" />
                            <span className="text-[8px] font-bold uppercase">{slot.label}</span>
                          </div>
                        )}

                        {item && <span className="drop-shadow-md text-white filter brightness-110">{slot.icon}</span>}

                        {isHighlighted && (
                          <div className="absolute top-0 right-0 bg-[#ffd27a] text-[8px] text-[#5a3d25] px-1 py-0.5 rounded-bl font-black">
                            NEW
                          </div>
                        )}

                        {item && (
                          <div className="absolute bottom-0 right-0 bg-black/70 text-[8px] text-white px-1 py-0.5 rounded-tl font-bold">
                            {item.level}
                          </div>
                        )}

                        {item && item.rarity !== 'Common' && (
                          <div className="absolute inset-0 bg-white/10 rounded"></div>
                        )}
                      </div>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="z-[100]">
                    {tooltipContent}
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        </div>
      </div>

      {selectedSlot && equipped[selectedSlot] && (
        <div className="mt-2 text-xs text-center text-[#6a5a44]">
          Selected: {equipped[selectedSlot]?.name}
        </div>
      )}
    </div>
  );
};
