import React from 'react';
import { Swords, Store, Shield } from 'lucide-react';
import { useUIStore } from '../../store/uiStore';
import type { TabType } from '../../store/uiStore';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab } = useUIStore();

  const NavButton = ({ tab, icon: Icon, label, emoji }: { tab: TabType, icon?: any, label: string, emoji?: string }) => {
    const isActive = activeTab === tab;

    return (
      <button
        onClick={() => setActiveTab(tab)}
        className="relative flex flex-col items-center gap-1 transition-all active:scale-90 min-w-[60px]"
      >
        <div className={`relative rounded-2xl flex items-center justify-center transition-all shadow-lg border-2
          w-12 h-12 bg-gradient-to-b from-[#6b4a2c] to-[#4b321e] border-[#c9a46a]
          ${isActive ? 'brightness-110 scale-105 border-[#ffdca0]' : ''}
        `}>
          <div className="absolute inset-1 rounded-xl bg-[radial-gradient(circle_at_30%_30%,#ffffff33,transparent_50%)]" />
          {emoji ? (
            <span className="relative z-10 text-2xl">{emoji}</span>
          ) : (
            <Icon size={24} className="relative z-10 text-white" />
          )}

          {isActive && (
            <div className="absolute -bottom-1 w-2 h-2 bg-[#ffd27a] rounded-full shadow-lg"></div>
          )}
        </div>

        <span className={`text-[9px] font-bold transition-colors ${isActive ? 'text-[#ffd27a]' : 'text-[#d0b28a]'}`}>
          {label}
        </span>
      </button>
    );
  };

  return (
    <div className="relative h-20 bg-gradient-to-t from-[#3f2a18] to-[#5a3a21] border-t-2 border-[#c9a46a] flex justify-around items-center px-3 shrink-0 z-40 shadow-[0_-4px_12px_rgba(0,0,0,0.35)]">
      <div className="absolute inset-x-4 top-1 h-1 bg-[#2a1b10]/60 rounded-full" />
      <NavButton tab="HERO" icon={Shield} label="HERO" />
      <NavButton tab="LAMP" emoji="🧞" label="LAMP" />
      <NavButton tab="CAMP" emoji="🏕️" label="CAMP" />
      <NavButton tab="BATTLE" icon={Swords} label="BATTLE" />
      <NavButton tab="SHOP" icon={Store} label="SHOP" />
    </div>
  );
};
