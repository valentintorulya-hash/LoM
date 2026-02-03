import React from 'react';
import { usePetStore, PETS_DATA } from '../../store/petStore';
import { useGameStore } from '../../store/gameStore';
import { formatNumber } from '../../lib/formatters';

export const PetTab: React.FC = () => {
  const { unlockedIds, petLevels, unlockPet } = usePetStore();
  const { currencies } = useGameStore();

  return (
    <div className="flex-1 overflow-y-auto bg-gradient-to-b from-[#f4e4c8] to-[#e0c49a] p-3 space-y-3">
      <div className="rounded-2xl border-2 border-[#f0d08a] bg-gradient-to-b from-[#f7e7cc] to-[#d7b483] shadow-[0_8px_16px_rgba(0,0,0,0.25)] overflow-hidden">
        <div className="px-4 py-3 bg-gradient-to-b from-[#7f5a39] to-[#5a3d25] border-b-2 border-[#d2b07a]">
          <h2 className="text-[12px] font-black uppercase tracking-wider text-[#ffe9bf]">Companions</h2>
        </div>

        <div className="p-3 grid grid-cols-1 gap-3">
          {PETS_DATA.map((pet) => {
            const isUnlocked = unlockedIds.includes(pet.id);
            const level = petLevels[pet.id] || 0;
            const canAfford = currencies.gold.gte(pet.unlockCost);

            return (
              <div key={pet.id} className={`rounded-2xl border-2 shadow-[0_4px_10px_rgba(0,0,0,0.2)] overflow-hidden ${isUnlocked ? 'border-[#f0d08a] bg-gradient-to-b from-[#f7e7cc] to-[#d7b483]' : 'border-[#caa977] bg-gradient-to-b from-[#e9d3aa] to-[#c8a06b] opacity-90'}`}>
                <div className="p-3 flex items-center gap-3">
                  <div className="text-3xl bg-gradient-to-b from-[#8a623f] to-[#5a3d25] w-14 h-14 rounded-full flex items-center justify-center border-2 border-[#d2b07a] shadow-inner">
                    {pet.icon}
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="font-black text-[#5a3d25] text-sm">{pet.name}</h3>
                      {isUnlocked && (
                        <span className="text-[9px] font-black text-[#5a3d25] bg-[#ffd27a] px-2 py-0.5 rounded-full border-2 border-[#f0d08a]">
                          Lv.{level}
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-[#6a5a44] mt-1">{pet.description}</p>

                    {!isUnlocked ? (
                      <button
                        onClick={() => unlockPet(pet.id)}
                        disabled={!canAfford}
                        className={`mt-3 w-full py-2 rounded-xl font-black text-[10px] transition-all border-2
                          ${canAfford
                            ? 'bg-gradient-to-b from-[#ffd27a] to-[#d49a47] text-[#4a2f1a] border-[#fff2cc] shadow-inner'
                            : 'bg-gray-400 text-gray-600 border-gray-500 cursor-not-allowed'
                          }
                        `}
                      >
                        Unlock: {formatNumber(pet.unlockCost)} 💰
                      </button>
                    ) : (
                      <div className="mt-3 flex items-center gap-2">
                        <div className="flex-1 bg-gradient-to-b from-[#7f5a39] to-[#5a3d25] rounded-lg border-2 border-[#d2b07a] px-3 py-1 flex items-center">
                          <span className="text-[9px] font-black text-[#ffe9bf] uppercase">Active Bonus</span>
                        </div>
                        <div className="px-2 py-1 rounded-lg bg-[#2b1f14] border-2 border-[#d2b07a] text-[9px] font-black text-[#ffd27a]">
                          +{level * 2}%
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
