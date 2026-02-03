import React from 'react';
import { Bell, Calendar, Gift, Mail, Settings, Trophy } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';
import { useInventoryStore } from '../../store/inventoryStore';
import { useCombatController } from '../game/Combat/useCombatController';
import { formatNumber } from '../../lib/formatters';
import { AnimatedHPBar } from '../ui/AnimatedHPBar';
import { useUIStore } from '../../store/uiStore';

export const TopBar: React.FC = () => {
  const { currencies, playerLevel } = useGameStore();
  const { currentHp, playerStats } = useInventoryStore();
  const { stage } = useCombatController();
  const { setOverlay } = useUIStore();

  const hpPercent = currentHp.div(playerStats['HP'].max(1)).times(100).toNumber();

  const EventButton = ({ icon: Icon, label, onClick }: { icon: any, label: string, onClick?: () => void }) => (
    <button
      onClick={onClick}
      className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-gradient-to-b from-[#6b4a2c] to-[#4b321e] border border-[#c9a46a] shadow-inner hover:brightness-110 active:scale-95 transition-all"
    >
      <Icon size={11} className="text-[#ffd27a]" />
      <span className="text-[8px] font-black text-[#ffe9bf] uppercase tracking-[0.12em]">{label}</span>
    </button>
  );

  return (
    <div className="relative z-20 p-2 pb-1">
      <div className="relative rounded-2xl bg-gradient-to-b from-[#8b623b] via-[#6f4c2e] to-[#4e351f] border-2 border-[#c9a46a] shadow-[0_6px_14px_rgba(0,0,0,0.35)] overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_20%_20%,#ffffff33,transparent_40%),radial-gradient(circle_at_80%_30%,#ffffff22,transparent_45%)]" />
        <div className="relative flex items-center justify-between gap-2 px-2 py-1.5">
          <div className="flex items-center gap-2">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full border-3 border-[#f0d08a] bg-gradient-to-br from-[#7fd18a] to-[#2f8f5a] shadow-lg flex items-center justify-center text-2xl">
                🍄
              </div>
              <div className="mt-1 bg-gradient-to-r from-[#f3a245] to-[#d67a2d] text-white text-[9px] font-black px-2 py-0.5 rounded-full border-2 border-[#fff2cc] shadow-md">
                Lv {playerLevel}
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1">
                <AnimatedHPBar
                  current={hpPercent}
                  max={100}
                  className="w-24 h-2.5 bg-gradient-to-r from-[#3f1d1d] to-[#5a1f1f] border border-[#2a0f0f] shadow-inner"
                  indicatorClassName="bg-gradient-to-r from-[#6ee7a8] via-[#4fd08a] to-[#6ee7a8]"
                />
                <span className="text-[9px] font-bold text-[#fff7e0] drop-shadow-md min-w-[20px]">
                  {Math.floor(hpPercent)}%
                </span>
              </div>
              <div className="flex items-center gap-1 text-[10px] font-bold text-[#ffe29a] drop-shadow-md">
                <span className="text-[11px]">⚔️</span>
                <span>{formatNumber(playerStats['Attack'])}</span>
              </div>
            </div>
          </div>

          <div className="relative flex flex-col items-center rounded-xl px-3 py-1 bg-gradient-to-b from-[#3b2a1a] to-[#2a1d12] border-2 border-[#c9a46a] shadow-md">
            <div className="text-[9px] text-[#ffeac0] font-bold uppercase tracking-wider">Stage</div>
            <div className="text-base font-black text-white drop-shadow-md leading-none">{stage}</div>
          </div>

          <div className="flex flex-col items-end gap-1">
            <div className="flex flex-wrap items-center justify-end gap-1 max-w-[160px]">
              <div className="flex items-center gap-0.5 bg-gradient-to-r from-[#f3c66b] to-[#d49a47] pl-1.5 pr-1.5 py-1 rounded-full shadow-md border border-[#fff2cc]">
                <span className="text-xs">💡</span>
                <span className="text-[10px] font-bold text-white min-w-[28px] text-right">{formatNumber(currencies.lamps)}</span>
              </div>

              <div className="flex items-center gap-0.5 bg-gradient-to-r from-[#d9a441] to-[#b57d25] pl-1.5 pr-1.5 py-1 rounded-full shadow-md border border-[#f0d08a]">
                <span className="text-xs">💰</span>
                <span className="text-[10px] font-bold text-white min-w-[40px] text-right">{formatNumber(currencies.gold)}</span>
              </div>

              <div className="flex items-center gap-0.5 bg-gradient-to-r from-[#6fb6ff] to-[#3b76d6] pl-1.5 pr-1.5 py-1 rounded-full shadow-md border border-[#a6d0ff]">
                <span className="text-xs">💎</span>
                <span className="text-[10px] font-bold text-white min-w-[28px] text-right">{formatNumber(currencies.diamonds)}</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button className="w-6 h-6 bg-gradient-to-br from-[#514539] to-[#3a2f26] rounded-full flex items-center justify-center shadow-md border border-[#c9a46a] hover:brightness-110 active:scale-95 transition-all">
                <Bell size={11} className="text-[#ffe6b0]" />
              </button>
              <button className="w-6 h-6 bg-gradient-to-br from-[#514539] to-[#3a2f26] rounded-full flex items-center justify-center shadow-md border border-[#c9a46a] hover:brightness-110 active:scale-95 transition-all">
                <Gift size={11} className="text-[#ffe6b0]" />
              </button>
              <button className="w-6 h-6 bg-gradient-to-br from-[#514539] to-[#3a2f26] rounded-full flex items-center justify-center shadow-md border border-[#c9a46a] hover:brightness-110 active:scale-95 transition-all">
                <Settings size={11} className="text-[#ffe6b0]" />
              </button>
            </div>
          </div>
        </div>

        <div className="relative flex flex-wrap items-center justify-between gap-1.5 px-2 pb-2">
          <div className="flex items-center gap-1">
            <EventButton icon={Calendar} label="Daily" onClick={() => setOverlay('DAILY')} />
            <EventButton icon={Trophy} label="Arena" onClick={() => setOverlay('ARENA')} />
            <EventButton icon={Mail} label="Mail" onClick={() => setOverlay('MAIL')} />
          </div>
          <div className="flex items-center gap-1">
            <EventButton icon={Gift} label="Event" onClick={() => setOverlay('EVENT')} />
            <EventButton icon={Bell} label="News" onClick={() => setOverlay('NEWS')} />
          </div>
        </div>
      </div>
    </div>
  );
};
