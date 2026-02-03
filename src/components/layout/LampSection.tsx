import React from 'react';
import { useLampController } from '../game/Lamp/useLampController';
import { GachaMachine } from '../game/Gacha/GachaMachine';
import { Play, Pause } from 'lucide-react';

export const LampSection: React.FC = () => {
  const { isAutoMode, toggleAutoMode } = useLampController();

  return (
    <div className="flex flex-col items-center pb-4 px-4 relative h-full overflow-y-auto">
      
      {/* The Lamp Interface - Main Focus */}
      <div className="relative w-full flex flex-col items-center flex-1">
         <GachaMachine />
      </div>

      {/* Auto Toggle Button - Bottom Right Corner */}
      <button 
        onClick={toggleAutoMode}
        className={`
          fixed bottom-24 right-6 z-30
          w-14 h-14 rounded-full shadow-2xl border-3
          flex items-center justify-center
          transition-all duration-300 active:scale-90
          ${isAutoMode 
            ? 'bg-gradient-to-br from-orange-400 to-orange-600 border-orange-300 animate-pulse shadow-orange-500/50' 
            : 'bg-gradient-to-br from-gray-600 to-gray-800 border-gray-500 hover:scale-105'
          }
        `}
      >
        {isAutoMode ? (
          <Pause className="text-white" size={24} fill="white" />
        ) : (
          <Play className="text-white ml-0.5" size={24} fill="white" />
        )}
        
        {/* Pulsing ring when active */}
        {isAutoMode && (
          <div className="absolute inset-0 rounded-full border-4 border-orange-400 animate-ping opacity-75"></div>
        )}
        
        {/* Label */}
        <div className={`
          absolute -top-8 left-1/2 -translate-x-1/2 
          text-[9px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap
          ${isAutoMode ? 'bg-orange-500 text-white' : 'bg-gray-700 text-gray-300'}
          border ${isAutoMode ? 'border-orange-300' : 'border-gray-500'}
        `}>
          AUTO {isAutoMode ? 'ON' : 'OFF'}
        </div>
      </button>

    </div>
  );
};
