import React from 'react';
import type { Item } from '../../lib/gameTypes';
import { RARITY_CONFIG } from '../../lib/constants';
import { formatNumber } from '../../lib/formatters';
import { Sword, Shirt, Footprints, Gem, Cross, Shield, Hand, Accessibility, Watch } from 'lucide-react';
import { ItemSlot } from '../../lib/gameTypes';

interface ItemCardProps {
  item: Item;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

const SLOT_ICONS: Record<string, React.ReactElement> = {
  [ItemSlot.WEAPON]: <Sword />,
  [ItemSlot.HELMET]: <Shield />,
  [ItemSlot.ARMOR]: <Shirt />,
  [ItemSlot.BOOTS]: <Footprints />,
  [ItemSlot.GLOVES]: <Hand />,
  [ItemSlot.PANTS]: <Accessibility />,
  [ItemSlot.RING1]: <Gem />,
  [ItemSlot.RING2]: <Gem />,
  [ItemSlot.AMULET]: <Cross />,
  [ItemSlot.BRACELET]: <Watch />,
  [ItemSlot.BELT]: <div className="font-bold text-xs">BELT</div>,
  [ItemSlot.CAPE]: <div className="font-bold text-xs">CAPE</div>,
};

export const ItemCard: React.FC<ItemCardProps> = ({ item, size = 'md', onClick }) => {
  const config = RARITY_CONFIG[item.rarity];
  
  const sizeClasses = {
    sm: 'w-16 h-16 text-xs',
    md: 'w-24 h-24 text-sm',
    lg: 'w-32 h-32 text-base',
  };

  const iconSizes = {
    sm: 20,
    md: 32,
    lg: 48,
  };

  return (
    <div 
      onClick={onClick}
      className={`
        relative rounded-xl border-2 flex flex-col items-center justify-center
        bg-slate-800 transition-all duration-200
        ${config.borderColor} ${config.color} ${config.bgGlow}
        ${sizeClasses[size]}
        ${onClick ? 'cursor-pointer hover:scale-105 active:scale-95' : ''}
        shadow-lg
      `}
    >
      {/* Glow Background */}
      <div className={`absolute inset-0 opacity-20 bg-current blur-md rounded-xl pointer-events-none`} />

      {/* Icon */}
      <div className="relative z-10 drop-shadow-md">
        {/* Render icon based on size prop - simplified approach */}
        <div style={{ width: iconSizes[size], height: iconSizes[size] }} className="flex items-center justify-center">
             {SLOT_ICONS[item.slot] && React.cloneElement(SLOT_ICONS[item.slot] as React.ReactElement, { size: iconSizes[size] } as Record<string, unknown>)}
        </div>
      </div>

      {/* Level Tag */}
      <div className="absolute top-1 right-1 bg-black/60 px-1.5 py-0.5 rounded text-[10px] font-mono text-white border border-white/10">
        Lv.{item.level}
      </div>

      {/* Main Stat (Only for larger cards) */}
      {size !== 'sm' && (
        <div className="absolute bottom-1 w-full text-center font-bold drop-shadow-md text-white">
          {formatNumber(item.mainStat.value)}
        </div>
      )}
    </div>
  );
};
