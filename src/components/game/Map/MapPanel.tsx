import React, { useEffect, useMemo } from 'react';
import { Compass, Flag, MapPin } from 'lucide-react';
import { useCombatStore } from '../../../store/combatStore';
import { useMapStore } from '../../../store/mapStore';

export const MapPanel: React.FC = () => {
  const { stage, setStage } = useCombatStore();
  const { areas, activeAreaId, unlockedAreaIds, setActiveArea, unlockArea } = useMapStore();

  const activeArea = useMemo(
    () => areas.find((area) => area.id === activeAreaId) ?? areas[0],
    [areas, activeAreaId]
  );

  useEffect(() => {
    areas.forEach((area, index) => {
      if (stage > area.endStage) {
        const next = areas[index + 1];
        if (next) unlockArea(next.id);
      }
    });
  }, [areas, stage, unlockArea]);

  const handleEnter = (areaId: string, startStage: number) => {
    setActiveArea(areaId);
    setStage(startStage);
  };

  return (
    <div className="flex-1 bg-gradient-to-b from-[#e8dcc5] to-[#f0e6d2] p-3 flex flex-col gap-3">
      <div className="rounded-2xl border-2 border-[#f0d08a] bg-gradient-to-b from-[#f7e7cc] to-[#d7b483] shadow-[0_6px_12px_rgba(0,0,0,0.2)] p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#5a3d25]">
            <Compass size={14} className="text-[#d49a47]" />
            <span className="text-[11px] font-black uppercase tracking-wider">World Map</span>
          </div>
          <div className="text-[10px] font-black text-[#4a2f1a]">Stage {stage}</div>
        </div>

        <div className="mt-2 flex items-center gap-2">
          <div className="text-2xl">{activeArea.environment}</div>
          <div>
            <div className="text-[11px] font-black text-[#5a3d25]">{activeArea.name}</div>
            <div className="text-[9px] text-[#6a5a44]">{activeArea.description}</div>
          </div>
        </div>

        <div className="mt-2 rounded-full bg-[#4a3320]/40 border border-[#d2b07a] overflow-hidden h-2">
          <div
            className="h-full bg-gradient-to-r from-[#7dd3fc] to-[#3b82f6]"
            style={{
              width: `${Math.min(100, ((stage - activeArea.startStage + 1) / (activeArea.endStage - activeArea.startStage + 1)) * 100)}%`,
            }}
          />
        </div>
        <div className="mt-1 text-[9px] text-[#6a5a44]">
          {activeArea.startStage}-{activeArea.endStage}
        </div>
      </div>

      <div className="rounded-2xl border-2 border-[#f0d08a] bg-gradient-to-b from-[#f7e7cc] to-[#d7b483] shadow-[0_6px_12px_rgba(0,0,0,0.2)] p-3 space-y-2">
        <div className="flex items-center gap-2 text-[#5a3d25]">
          <MapPin size={12} className="text-[#d49a47]" />
          <span className="text-[10px] font-black uppercase tracking-wider">Areas</span>
        </div>

        {areas.map((area) => {
          const isUnlocked = unlockedAreaIds.includes(area.id);
          const isActive = area.id === activeAreaId;

          return (
            <div
              key={area.id}
              className={`rounded-xl border-2 p-3 shadow-inner flex items-center justify-between gap-2
                ${isActive ? 'border-[#ffd27a] bg-gradient-to-b from-[#f9e8cc] to-[#e1bf8b]' : 'border-[#d2b07a] bg-gradient-to-b from-[#f7e7cc] to-[#d7b483]'}
              `}
            >
              <div className="flex items-center gap-2">
                <div className="text-xl">{area.environment}</div>
                <div>
                  <div className="text-[11px] font-black text-[#5a3d25]">{area.name}</div>
                  <div className="text-[9px] text-[#6a5a44]">Stage {area.startStage}-{area.endStage}</div>
                </div>
              </div>

              <button
                onClick={() => handleEnter(area.id, area.startStage)}
                disabled={!isUnlocked}
                className={`px-3 py-1 rounded-lg text-[9px] font-black border-2 transition-all flex items-center gap-1
                  ${isUnlocked
                    ? 'bg-gradient-to-b from-[#6ee7a8] to-[#2f8f5a] text-[#0f3d2b] border-[#b7f0d3]'
                    : 'bg-gray-400 text-gray-600 border-gray-500'
                  }
                `}
              >
                <Flag size={12} />
                {isActive ? 'Here' : 'Enter'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
