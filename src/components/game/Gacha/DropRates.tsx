import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Info, Sparkles } from 'lucide-react';
import { RARITY_CONFIG } from '../../../lib/constants';

const DROP_RATES = [
  { name: 'Common', rate: '53.0%', weight: 1000 },
  { name: 'Uncommon', rate: '27.0%', weight: 500 },
  { name: 'Rare', rate: '13.5%', weight: 250 },
  { name: 'Epic', rate: '5.5%', weight: 100 },
  { name: 'Legendary', rate: '0.9%', weight: 25 },
  { name: 'Mythic', rate: '0.1%', weight: 5 },
];

export const DropRates: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full max-w-md mx-auto mb-3">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={
          `flex items-center justify-center gap-2 w-full py-2 px-4 rounded-xl
          transition-all duration-300
          ${isOpen
            ? 'bg-gradient-to-b from-[#7f5a39] to-[#5a3d25] border-2 border-[#d2b07a]'
            : 'bg-gradient-to-b from-[#6b4a2c] to-[#4b321e] border-2 border-[#c9a46a] hover:brightness-110'
          }
          shadow-[0_4px_10px_rgba(0,0,0,0.25)]`
        }
      >
        <Info size={14} className="text-[#ffd27a]" />
        <span className="text-[10px] font-black text-[#ffe9bf] uppercase tracking-wider">
          Drop Rates
        </span>
        {isOpen ? (
          <ChevronUp size={14} className="text-[#ffd27a]" />
        ) : (
          <ChevronDown size={14} className="text-[#ffd27a]" />
        )}
      </button>

      {isOpen && (
        <div className="mt-2 rounded-2xl border-2 border-[#f0d08a] bg-gradient-to-b from-[#f7e7cc] to-[#d7b483] p-3 shadow-[0_6px_12px_rgba(0,0,0,0.25)] animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center justify-center gap-2 mb-3 pb-2 border-b border-[#d2b07a]">
            <Sparkles className="text-[#ffd27a]" size={14} />
            <span className="text-[11px] font-black text-[#5a3d25] uppercase tracking-wider">Summon Probabilities</span>
          </div>

          <div className="space-y-2">
            {DROP_RATES.map((rate) => {
              // @ts-expect-error key access
              const config = RARITY_CONFIG[rate.name];
              const colorClass = config?.color || 'text-white';
              const borderColor = config?.borderColor || 'border-white';

              return (
                <div
                  key={rate.name}
                  className={
                    `flex items-center justify-between p-2 rounded-lg
                    bg-gradient-to-b from-[#7f5a39] to-[#5a3d25]
                    border ${borderColor.replace('border-', 'border-').replace(/\d+/, '400')}
                    shadow-inner`
                  }
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${colorClass.replace('text-', 'bg-')} shadow-lg`} />
                    <span className={`font-black text-[11px] ${colorClass}`}>
                      {rate.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-1.5 bg-black/30 rounded-full overflow-hidden border border-[#d2b07a]">
                      <div
                        className={`h-full ${colorClass.replace('text-', 'bg-')} rounded-full`}
                        style={{ width: `${(rate.weight / 1000) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-[#ffe9bf] font-mono text-[11px] min-w-[48px] text-right font-black">{rate.rate}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-3 pt-2 border-t border-[#d2b07a] text-center text-[10px] text-[#6a5a44] italic">
            Higher lamp levels may increase rare drop chances
          </div>
        </div>
      )}
    </div>
  );
};
