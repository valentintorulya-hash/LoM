import React, { useState } from 'react';
import { Sparkles, Lock, Check, Star } from 'lucide-react';
import { useEvolutionStore, EVOLUTION_STAGES } from '../../../store/evolutionStore';
import { useGameStore } from '../../../store/gameStore';
import { useCombatStore } from '../../../store/combatStore';
import { formatNumber } from '../../../lib/formatters';
import { Decimal } from '../../../lib/decimal';
import { OverlayPanel } from '../../layout/OverlayPanel';

interface EvolutionPanelProps {
  onClose: () => void;
}

export const EvolutionPanel: React.FC<EvolutionPanelProps> = ({ onClose }) => {
  const { currentStageId, canEvolve, evolve, getNextStage, getCurrentStage, getEvolutionBonuses, isMaxEvolution } = useEvolutionStore();
  const { playerLevel, currencies } = useGameStore();
  const { stage: combatStage } = useCombatStore();
  const [showAnimation, setShowAnimation] = useState(false);

  const currentStage = getCurrentStage();
  const nextStage = getNextStage();
  const evolutionBonuses = getEvolutionBonuses();

  const handleEvolve = () => {
    if (!canEvolve()) return;
    
    setShowAnimation(true);
    setTimeout(() => {
      evolve();
      setShowAnimation(false);
    }, 2000);
  };

  const getStageStatus = (_id: string, index: number) => {
    const currentIndex = EVOLUTION_STAGES.findIndex(s => s.id === currentStageId);
    
    if (index < currentIndex) return 'completed';
    if (index === currentIndex) return 'current';
    return 'locked';
  };

  const canAfford = (stage: typeof EVOLUTION_STAGES[number]) => {
    const cost = stage.cost as { gold?: Decimal; diamonds?: Decimal };
    if (!cost.gold && !cost.diamonds) return true;
    if (cost.gold && currencies.gold.lt(cost.gold)) return false;
    if (cost.diamonds && currencies.diamonds.lt(cost.diamonds)) return false;
    return true;
  };

  return (
    <OverlayPanel title="Evolution" onClose={onClose}>
      <div className="space-y-4">
        {/* Current Stage Display */}
        <div className="rounded-2xl border-2 border-[#f0d08a] bg-gradient-to-b from-[#f7e7cc] to-[#d7b483] p-4 shadow-inner">
          <div className="flex items-center justify-center mb-4">
            <div 
              className="w-24 h-24 rounded-full flex items-center justify-center text-5xl shadow-[0_0_30px_rgba(0,0,0,0.3)] border-4"
              style={{ 
                background: `linear-gradient(135deg, ${currentStage.color}22, ${currentStage.color}66)`,
                borderColor: currentStage.color,
                boxShadow: `0 0 30px ${currentStage.color}40`,
              }}
            >
              {showAnimation ? '✨' : currentStage.icon}
            </div>
          </div>
          
          <div className="text-center">
            <h3 className="text-lg font-black text-[#5a3d25]">{currentStage.name}</h3>
            <p className="text-[10px] text-[#6a5a44] mt-1">{currentStage.description}</p>
          </div>

          {/* Current Bonuses */}
          {Object.keys(evolutionBonuses).length > 0 && (
            <div className="mt-4 p-3 rounded-xl bg-[#5a3d25]/10 border border-[#d2b07a]">
              <div className="text-[10px] font-black text-[#5a3d25] uppercase tracking-wider mb-2 flex items-center gap-1">
                <Star size={12} className="text-[#ffd27a]" />
                Current Bonuses
              </div>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(evolutionBonuses).map(([stat, value]) => (
                  <div key={stat} className="flex items-center justify-between text-[10px]">
                    <span className="text-[#6a5a44] capitalize">{stat}</span>
                    <span className="font-bold text-green-600">x{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Evolution Path */}
        {!isMaxEvolution() && (
          <div className="rounded-2xl border-2 border-[#d2b07a] bg-gradient-to-b from-[#f9e8cc] to-[#d7b483] p-4 shadow-inner">
            <div className="text-[10px] font-black text-[#5a3d25] uppercase tracking-wider mb-3 flex items-center gap-1">
              <Sparkles size={12} className="text-[#ffd27a]" />
              Evolution Path
            </div>
            
            <div className="space-y-2">
              {EVOLUTION_STAGES.map((stage, index) => {
                const status = getStageStatus(stage.id, index);
                
                return (
                  <div 
                    key={stage.id}
                    className={`
                      rounded-xl p-3 flex items-center gap-3 transition-all
                      ${status === 'completed' ? 'bg-green-500/20 border border-green-500/30' : ''}
                      ${status === 'current' ? 'bg-[#ffd27a]/20 border-2 border-[#ffd27a]' : ''}
                      ${status === 'locked' ? 'bg-black/5 opacity-60' : ''}
                    `}
                  >
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center text-xl border-2"
                      style={{ 
                        background: `${stage.color}30`,
                        borderColor: status === 'locked' ? '#999' : stage.color,
                      }}
                    >
                      {status === 'completed' ? <Check size={16} className="text-green-600" /> : stage.icon}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#5a3d25] text-sm">{stage.name}</span>
                        {status === 'current' && (
                          <span className="text-[8px] bg-[#ffd27a] text-[#5a3d25] px-1.5 py-0.5 rounded-full font-black">
                            CURRENT
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-[9px] text-[#6a5a44]">
                        <span>Lv.{stage.reqLevel}</span>
                        <span>•</span>
                        <span>Stage {stage.reqStage}</span>
                      </div>
                    </div>

                    {status === 'locked' && (
                      <Lock size={14} className="text-gray-400" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Next Evolution Requirements */}
        {nextStage && (
          <div className="rounded-2xl border-2 border-[#d2b07a] bg-gradient-to-b from-[#f9e8cc] to-[#d7b483] p-4 shadow-inner">
            <div className="text-[10px] font-black text-[#5a3d25] uppercase tracking-wider mb-3">
              Next Evolution Requirements
            </div>
            
            <div className="space-y-2">
              <div className={`flex items-center justify-between text-[10px] p-2 rounded-lg ${playerLevel >= nextStage.reqLevel ? 'bg-green-500/20' : 'bg-red-500/10'}`}>
                <span className="text-[#6a5a44]">Player Level</span>
                <span className={playerLevel >= nextStage.reqLevel ? 'text-green-600 font-bold' : 'text-red-500 font-bold'}>
                  {playerLevel}/{nextStage.reqLevel}
                </span>
              </div>
              
              <div className={`flex items-center justify-between text-[10px] p-2 rounded-lg ${combatStage >= nextStage.reqStage ? 'bg-green-500/20' : 'bg-red-500/10'}`}>
                <span className="text-[#6a5a44]">Stage Progress</span>
                <span className={combatStage >= nextStage.reqStage ? 'text-green-600 font-bold' : 'text-red-500 font-bold'}>
                  {combatStage}/{nextStage.reqStage}
                </span>
              </div>

              {(() => {
                const nextCost = nextStage.cost as { gold?: Decimal; diamonds?: Decimal };
                return (
                  <>
                    {nextCost.gold && (
                      <div className={`flex items-center justify-between text-[10px] p-2 rounded-lg ${canAfford(nextStage) ? 'bg-green-500/20' : 'bg-red-500/10'}`}>
                        <span className="text-[#6a5a44]">Gold Cost</span>
                        <span className={canAfford(nextStage) ? 'text-green-600 font-bold' : 'text-red-500 font-bold'}>
                          {formatNumber(currencies.gold)}/{formatNumber(nextCost.gold)}
                        </span>
                      </div>
                    )}

                    {nextCost.diamonds && (
                      <div className={`flex items-center justify-between text-[10px] p-2 rounded-lg ${currencies.diamonds.gte(nextCost.diamonds) ? 'bg-green-500/20' : 'bg-red-500/10'}`}>
                        <span className="text-[#6a5a44]">Diamond Cost</span>
                        <span className={currencies.diamonds.gte(nextCost.diamonds) ? 'text-green-600 font-bold' : 'text-red-500 font-bold'}>
                          {formatNumber(currencies.diamonds)}/{formatNumber(nextCost.diamonds)}
                        </span>
                      </div>
                    )}
                  </>
                );
              })()}
            </div>

            <button
              onClick={handleEvolve}
              disabled={!canEvolve() || showAnimation}
              className={`
                w-full mt-4 py-3 rounded-xl font-black text-sm border-2 transition-all
                ${canEvolve() && !showAnimation
                  ? 'bg-gradient-to-b from-[#ffd27a] to-[#d49a47] text-[#4a2f1a] border-[#fff2cc] hover:brightness-110 active:scale-95'
                  : 'bg-gray-400 text-gray-600 border-gray-500 cursor-not-allowed'
                }
              `}
            >
              {showAnimation ? (
                <span className="flex items-center justify-center gap-2">
                  <Sparkles size={16} className="animate-spin" />
                  Evolving...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Sparkles size={16} />
                  EVOLVE!
                </span>
              )}
            </button>
          </div>
        )}

        {isMaxEvolution() && (
          <div className="rounded-2xl border-2 border-[#ffd27a] bg-gradient-to-b from-[#ffd27a]/30 to-[#d49a47]/30 p-4 text-center">
            <div className="text-4xl mb-2">👑</div>
            <h3 className="font-black text-[#5a3d25]">Maximum Evolution Reached!</h3>
            <p className="text-[10px] text-[#6a5a44] mt-1">
              You have reached the pinnacle of mushroom evolution!
            </p>
          </div>
        )}
      </div>
    </OverlayPanel>
  );
};
