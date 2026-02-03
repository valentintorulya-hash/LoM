import React, { useEffect, useState } from 'react';
import { Coins, Sparkles, TrendingUp } from 'lucide-react';
import type { Item } from '../../../lib/gameTypes';
import { formatNumber } from '../../../lib/formatters';
import { RARITY_CONFIG } from '../../../lib/constants';
import { useInventoryStore } from '../../../store/inventoryStore';
import { RarityStars } from '../../ui/RarityStars';
import { toast } from '../../../store/toastStore';

interface SummonResultModalProps {
  item: Item;
  onClose: () => void;
  onEquip: () => void;
  onSell: () => void;
}

export const SummonResultModal: React.FC<SummonResultModalProps> = ({ item, onClose, onEquip, onSell }) => {
  const config = RARITY_CONFIG[item.rarity];
  const { equipped } = useInventoryStore();
  const [showContent, setShowContent] = useState(false);

  const currentEquipped = equipped[item.slot];
  const isUpgrade = currentEquipped ? item.mainStat.value.gt(currentEquipped.mainStat.value) : true;
  const statDiff = currentEquipped ? item.mainStat.value.minus(currentEquipped.mainStat.value) : item.mainStat.value;

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 220);

    if (item.rarity === 'Epic' || item.rarity === 'Legendary' || item.rarity === 'Mythic') {
      const toastMessages = {
        Epic: { type: 'info' as const, title: '🎉 Epic Item!', message: `You got a ${item.name}!` },
        Legendary: { type: 'warning' as const, title: '⭐ Legendary Item!', message: `Amazing! ${item.name} obtained!` },
        Mythic: { type: 'success' as const, title: '🔥 MYTHIC ITEM!', message: `INCREDIBLE! ${item.name}!!!` },
      };

      const toastData = toastMessages[item.rarity];
      toast[toastData.type](toastData.title, toastData.message, 5000);
    }

    return () => clearTimeout(timer);
  }, [item]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-300">
      <div
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          background: `radial-gradient(circle at center, ${config.color === 'text-red-500' ? '#ef4444' :
            config.color === 'text-yellow-400' ? '#facc15' :
            config.color === 'text-purple-400' ? '#c084fc' :
            config.color === 'text-blue-400' ? '#60a5fa' :
            config.color === 'text-green-400' ? '#4ade80' : '#9ca3af'}33, transparent 65%)`,
        }}
      />

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <Sparkles
            key={i}
            className={`absolute ${config.color} animate-pulse`}
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.2}s`,
              opacity: 0.6,
            }}
            size={12 + Math.random() * 8}
          />
        ))}
      </div>

      <div
        className={
          `relative w-full max-w-md rounded-3xl border-4 p-6 flex flex-col items-center gap-4 
          bg-gradient-to-b from-[#f7e7cc] to-[#d7b483]
          ${config.borderColor}
          shadow-[0_0_50px_rgba(0,0,0,0.6)]
          animate-in zoom-in-90 duration-500`
        }
      >
        <div
          className={
            `absolute -top-6 left-1/2 -translate-x-1/2 px-6 py-2 rounded-full 
            bg-gradient-to-b from-[#7f5a39] to-[#5a3d25]
            border-2 ${config.borderColor}
            text-[12px] uppercase tracking-[0.25em] font-black text-[#ffe9bf]
            shadow-xl`
          }
        >
          {item.rarity}
        </div>

        {showContent && (
          <>
            <div className="w-full mt-2 rounded-2xl bg-gradient-to-b from-[#7f5a39] to-[#5a3d25] border-2 border-[#d2b07a] px-3 py-2 flex items-center justify-between shadow-inner">
              <div className="text-[10px] font-black uppercase tracking-wider text-[#ffe9bf]">Slot</div>
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-black text-[#5a3d25] bg-[#ffd27a] px-2 py-0.5 rounded-full border-2 border-[#f0d08a]">NEW</span>
                <span className="text-[11px] font-black text-[#ffd27a]">{item.slot}</span>
              </div>
            </div>

            <div className="relative mt-1 w-36 h-36 rounded-2xl bg-gradient-to-b from-[#f9e8cc] to-[#d7b483] border-4 border-[#f0d08a] shadow-[0_8px_14px_rgba(0,0,0,0.3)]">
              <div className="absolute -inset-2 rounded-2xl border-2 border-[#fff2cc]/70 animate-pulse" />
              <div className={`absolute inset-2 rounded-2xl ${config.borderColor.replace('border-', 'bg-')} bg-opacity-20`} />
              <div className="absolute inset-3 rounded-2xl bg-gradient-to-br from-[#fff3d4] to-[#e2b479] border-2 border-[#8a5a23] shadow-inner flex items-center justify-center">
                <div className="text-6xl drop-shadow-2xl">
                  {item.slot === 'Weapon' ? '⚔️' :
                  item.slot === 'Helmet' ? '🛡️' :
                  item.slot === 'Armor' ? '🎽' :
                  item.slot === 'Boots' ? '👢' :
                  item.slot === 'Gloves' ? '🧤' :
                  item.slot === 'Pants' ? '👖' :
                  item.slot.includes('Ring') ? '💍' :
                  item.slot === 'Amulet' ? '📿' :
                  item.slot === 'Bracelet' ? '📿' :
                  item.slot === 'Belt' ? '🎀' :
                  item.slot === 'Cape' ? '🧥' : '✨'}
                </div>
              </div>
              <Sparkles className="absolute top-2 right-2 text-white animate-pulse" size={18} />
              <Sparkles className="absolute bottom-2 left-2 text-white animate-pulse delay-150" size={14} />
            </div>

            <div className="flex flex-col items-center gap-1.5">
              <h2 className={`text-2xl font-black text-center ${config.color} drop-shadow-lg`}>
                {item.name}
              </h2>
              <RarityStars rarity={item.rarity} size={16} />
            </div>

            <div className="w-full bg-gradient-to-b from-[#7f5a39] to-[#5a3d25] rounded-2xl p-3 border-2 border-[#d2b07a] shadow-inner">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <TrendingUp className="text-[#7dd3fc]" size={18} />
                  <span className="text-[#ffe9bf] font-black text-[11px] uppercase">{item.mainStat.type}</span>
                </div>
                <span className={`text-3xl font-black ${config.color} drop-shadow-md`}>
                  {formatNumber(item.mainStat.value)}
                </span>
              </div>

              {currentEquipped && (
                <div className={`text-xs flex items-center justify-end gap-1 ${isUpgrade ? 'text-green-300' : 'text-red-300'}`}>
                  <span>{isUpgrade ? '▲' : '▼'}</span>
                  <span className="font-black">{isUpgrade ? '+' : ''}{formatNumber(statDiff)}</span>
                  <span className="text-[#ffe9bf]/70">vs equipped</span>
                </div>
              )}

              {!currentEquipped && (
                <div className="text-xs text-[#ffd27a] flex items-center justify-end gap-1">
                  <Sparkles size={14} />
                  <span>New slot!</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs text-[#5a3d25]">
              <Coins size={16} className="text-[#d49a47]" />
              <span>Sell value:</span>
              <span className="text-[#7a4c1c] font-black">{formatNumber(item.sellPrice)} Gold</span>
            </div>

            <div className="grid grid-cols-2 gap-3 w-full mt-2">
              <button
                onClick={onSell}
                className="group py-3 rounded-xl bg-gradient-to-b from-[#d46b57] to-[#a9422f] border-2 border-[#ffb4a6] text-white font-black text-sm hover:scale-105 transition-all active:scale-95 shadow-lg relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent group-hover:opacity-0 transition-opacity" />
                <div className="relative flex flex-col items-center">
                  <span>SELL</span>
                  <span className="text-[10px] text-[#ffd2c7]">+{formatNumber(item.sellPrice)}</span>
                </div>
              </button>

              <button
                onClick={onEquip}
                className={
                  `group py-3 rounded-xl font-black text-sm transition-all active:scale-95 shadow-xl relative overflow-hidden
                  ${isUpgrade
                    ? 'bg-gradient-to-b from-[#6ee7a8] to-[#2f8f5a] border-2 border-[#b7f0d3] text-[#0f3d2b] hover:scale-105'
                    : 'bg-gradient-to-b from-[#7dd3fc] to-[#3b82f6] border-2 border-[#c9e8ff] text-[#1c3a73] hover:scale-105'
                  }`
                }
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/15 to-transparent group-hover:opacity-0 transition-opacity" />
                <div className="relative flex items-center justify-center gap-2">
                  {isUpgrade && <TrendingUp size={18} />}
                  <span>EQUIP</span>
                </div>
                {isUpgrade && (
                  <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
