import React, { useState, useEffect } from 'react';
import { TopBar } from './TopBar';
import { CombatView } from './CombatView';
import { BottomNav } from './BottomNav';
import { useGameLoop } from '../../hooks/useGameLoop';
import { useUIStore } from '../../store/uiStore';
import { useAFKRewardsOnLoad } from '../../store/afkStore';
import { PetTab } from './PetTab';
import { HeroTab } from './HeroTab';
import { LampTab } from './LampTab';
import { DailyPanel } from '../game/Daily/DailyPanel';
import { MailPanel } from '../game/Mail/MailPanel';
import { ArenaPanel } from '../game/Arena/ArenaPanel';
import { DungeonPanel } from '../game/Dungeon/DungeonPanel';
import { MapPanel } from '../game/Map/MapPanel';
import { OverlayPlaceholder } from './OverlayPlaceholder';

export const MainLayout: React.FC = () => {
  useGameLoop(); // Activate Economy Ticker
  useAFKRewardsOnLoad(); // Check and claim AFK rewards on load
  
  const { activeTab, overlay, setOverlay } = useUIStore();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayTab, setDisplayTab] = useState(activeTab);

  useEffect(() => {
    if (activeTab !== displayTab) {
      setIsTransitioning(true);
      
      // Fade out current content
      setTimeout(() => {
        setDisplayTab(activeTab);
      }, 150);
      
      // Fade in new content
      setTimeout(() => {
        setIsTransitioning(false);
      }, 300);
    }
  }, [activeTab, displayTab]);

  return (
    <div className="w-full h-screen bg-gradient-to-b from-[#3a3a3a] to-[#1a1a1a] flex justify-center overflow-hidden">
      {/* Mobile Container */}
      <div className="w-full max-w-[480px] h-full bg-gradient-to-b from-[#fef9f3] to-[#f0e6d2] flex flex-col shadow-2xl relative">
        
        {/* TOP: Header (Always visible) */}
        <TopBar />

        {/* MAIN CONTENT AREA */}
        <div className="flex-1 overflow-hidden relative">
           <div 
             className={`
               absolute inset-0 flex flex-col transition-opacity duration-300
               ${isTransitioning ? 'opacity-0' : 'opacity-100'}
             `}
           >
             {displayTab === 'LAMP' ? (
               <LampTab />
              ) : displayTab === 'BATTLE' ? (
                <div className="flex flex-col h-full">
                  <div className="flex-1">
                    <CombatView />
                  </div>
                  <MapPanel />
                </div>
             ) : displayTab === 'CAMP' ? (
               <PetTab />
             ) : displayTab === 'HERO' ? (
               <HeroTab />
             ) : (
               <div className="flex-1 flex items-center justify-center text-gray-400 italic">
                  Tab {displayTab} coming soon...
               </div>
             )}
           </div>
        </div>

        {overlay && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-[440px] mx-4">
              {overlay === 'DAILY' && <DailyPanel onClose={() => setOverlay(null)} />}
              {overlay === 'MAIL' && <MailPanel onClose={() => setOverlay(null)} />}
              {overlay === 'ARENA' && <ArenaPanel onClose={() => setOverlay(null)} />}
              {overlay === 'DUNGEON' && <DungeonPanel onClose={() => setOverlay(null)} />}
              {overlay === 'EVENT' && <OverlayPlaceholder title="Event" onClose={() => setOverlay(null)} />}
              {overlay === 'NEWS' && <OverlayPlaceholder title="News" onClose={() => setOverlay(null)} />}
            </div>
          </div>
        )}

        {/* BOTTOM: Nav */}
        <BottomNav />

      </div>
    </div>
  );
};
