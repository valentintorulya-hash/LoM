import React from 'react';
import { CheckCircle, Gift } from 'lucide-react';
import { useQuestStore } from '../../../store/questStore';
import { formatNumber } from '../../../lib/formatters';
import { OverlayPanel } from '../../layout/OverlayPanel';

interface DailyPanelProps {
  onClose: () => void;
}

export const DailyPanel: React.FC<DailyPanelProps> = ({ onClose }) => {
  const { dailyQuests, claimQuest, claimAll } = useQuestStore();

  const claimable = dailyQuests.filter((quest) => !quest.claimed && quest.progress >= quest.goal).length;

  return (
    <OverlayPanel title="Daily Quests" onClose={onClose}>
      <div className="space-y-3">
        {dailyQuests.map((quest) => {
          const progressPercent = Math.min(100, (quest.progress / quest.goal) * 100);
          const isComplete = quest.progress >= quest.goal;

          return (
            <div key={quest.id} className="rounded-xl border-2 border-[#d2b07a] bg-gradient-to-b from-[#f9e8cc] to-[#d7b483] p-3 shadow-inner">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-[11px] font-black text-[#5a3d25]">{quest.title}</div>
                  <div className="text-[10px] text-[#6a5a44]">{quest.description}</div>
                </div>
                <div className="flex items-center gap-1 text-[9px] font-bold text-[#5a3d25]">
                  <CheckCircle size={12} className={isComplete ? 'text-green-500' : 'text-[#b89265]'} />
                  {quest.progress}/{quest.goal}
                </div>
              </div>

              <div className="mt-2 w-full h-2 rounded-full bg-[#4a3320]/40 overflow-hidden border border-[#d2b07a]">
                <div className="h-full bg-gradient-to-r from-[#7dd3fc] to-[#3b82f6]" style={{ width: `${progressPercent}%` }} />
              </div>

              <div className="mt-2 flex items-center justify-between">
                <div className="flex items-center gap-2 text-[9px] font-bold text-[#5a3d25]">
                  <Gift size={12} className="text-[#d49a47]" />
                  <span>+{formatNumber(quest.rewardGold)} Gold</span>
                  {quest.rewardLamps.gt(0) && <span>+{formatNumber(quest.rewardLamps)} Lamps</span>}
                  {quest.rewardDiamonds.gt(0) && <span>+{formatNumber(quest.rewardDiamonds)} Diamonds</span>}
                </div>
                <button
                  onClick={() => claimQuest(quest.id)}
                  disabled={!isComplete || quest.claimed}
                  className={`px-3 py-1 rounded-lg text-[9px] font-black border-2 transition-all
                    ${isComplete && !quest.claimed
                      ? 'bg-gradient-to-b from-[#6ee7a8] to-[#2f8f5a] text-[#0f3d2b] border-[#b7f0d3]'
                      : 'bg-gray-400 text-gray-600 border-gray-500'
                    }
                  `}
                >
                  {quest.claimed ? 'Claimed' : 'Claim'}
                </button>
              </div>
            </div>
          );
        })}

        <button
          onClick={claimAll}
          disabled={claimable === 0}
          className={`w-full py-2 rounded-xl text-[10px] font-black border-2 shadow-md
            ${claimable > 0
              ? 'bg-gradient-to-b from-[#ffd27a] to-[#d49a47] text-[#4a2f1a] border-[#fff2cc]'
              : 'bg-gray-400 text-gray-600 border-gray-500'
            }
          `}
        >
          Claim All
        </button>
      </div>
    </OverlayPanel>
  );
};
