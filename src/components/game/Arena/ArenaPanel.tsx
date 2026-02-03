import React from 'react';
import { Crown, RefreshCw, Swords, Trophy } from 'lucide-react';
import { OverlayPanel } from '../../layout/OverlayPanel';
import { useArenaStore } from '../../../store/arenaStore';
import { useInventoryStore } from '../../../store/inventoryStore';
import { formatNumber } from '../../../lib/formatters';

interface ArenaPanelProps {
  onClose: () => void;
}

export const ArenaPanel: React.FC<ArenaPanelProps> = ({ onClose }) => {
  const { rank, points, opponents, refreshOpponents, fightOpponent, dailyRewardClaimed, claimDailyReward } = useArenaStore();
  const { playerStats } = useInventoryStore();

  return (
    <OverlayPanel title="Arena" onClose={onClose}>
      <div className="space-y-3">
        <div className="flex items-center justify-between rounded-xl border-2 border-[#d2b07a] bg-gradient-to-b from-[#f9e8cc] to-[#d7b483] px-3 py-2 shadow-inner">
          <div className="flex items-center gap-2 text-[#5a3d25]">
            <Crown size={14} className="text-[#d49a47]" />
            <span className="text-[10px] font-black uppercase tracking-wider">Rank</span>
            <span className="text-[11px] font-black text-[#4a2f1a]">#{rank}</span>
          </div>
          <div className="flex items-center gap-2 text-[#5a3d25]">
            <Trophy size={14} className="text-[#d49a47]" />
            <span className="text-[10px] font-black uppercase tracking-wider">Points</span>
            <span className="text-[11px] font-black text-[#4a2f1a]">{points}</span>
          </div>
          <div className="text-[9px] font-bold text-[#6a5a44]">Power: {formatNumber(playerStats['Attack'])}</div>
        </div>

        <div className="flex items-center justify-between rounded-xl border-2 border-[#d2b07a] bg-gradient-to-b from-[#f9e8cc] to-[#d7b483] px-3 py-2 shadow-inner">
          <div className="text-[10px] font-black text-[#5a3d25]">Daily Reward</div>
          <button
            onClick={claimDailyReward}
            disabled={dailyRewardClaimed}
            className={`px-3 py-1 rounded-lg text-[9px] font-black border-2 transition-all
              ${!dailyRewardClaimed
                ? 'bg-gradient-to-b from-[#ffd27a] to-[#d49a47] text-[#4a2f1a] border-[#fff2cc]'
                : 'bg-gray-400 text-gray-600 border-gray-500'
              }
            `}
          >
            {dailyRewardClaimed ? 'Claimed' : 'Claim'}
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-[10px] font-black uppercase tracking-wider text-[#5a3d25]">Opponents</div>
          <button
            onClick={refreshOpponents}
            className="flex items-center gap-1 text-[9px] font-black text-[#5a3d25]"
          >
            <RefreshCw size={12} />
            Refresh
          </button>
        </div>

        <div className="space-y-2">
          {opponents.map((opponent) => (
            <div key={opponent.id} className="rounded-xl border-2 border-[#d2b07a] bg-gradient-to-b from-[#f9e8cc] to-[#d7b483] p-3 shadow-inner">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-black text-[#5a3d25]">{opponent.name}</div>
                  <div className="text-[10px] text-[#6a5a44]">Rank #{opponent.rank}</div>
                </div>
                <div className="text-[10px] font-bold text-[#5a3d25]">Power {opponent.power}</div>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <div className="text-[9px] font-bold text-[#5a3d25]">
                  +{formatNumber(opponent.rewardGold)} Gold
                  {opponent.rewardDiamonds.gt(0) && ` • +${formatNumber(opponent.rewardDiamonds)} Diamonds`}
                </div>
                <button
                  onClick={() => fightOpponent(opponent.id)}
                  className="px-3 py-1 rounded-lg text-[9px] font-black border-2 bg-gradient-to-b from-[#6ee7a8] to-[#2f8f5a] text-[#0f3d2b] border-[#b7f0d3]"
                >
                  <Swords size={12} className="inline mr-1" />
                  Battle
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </OverlayPanel>
  );
};
