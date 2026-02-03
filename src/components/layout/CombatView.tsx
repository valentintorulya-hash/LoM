import React from 'react';
import { Gift, Map, ScrollText, Trophy } from 'lucide-react';
import { useCombatController } from '../game/Combat/useCombatController';
import { useInventoryStore } from '../../store/inventoryStore';
import { useCombatStore } from '../../store/combatStore';
import { formatNumber } from '../../lib/formatters';
import { AnimatedHPBar } from '../ui/AnimatedHPBar';
import { FloatingDamageNumber } from '../ui/FloatingDamageNumber';
import { ParticleEffect } from '../ui/ParticleEffect';

export const CombatView: React.FC = () => {
  const { enemy, autoFight } = useCombatController();
  const { currentHp, playerStats } = useInventoryStore();
  const { damageInstances, removeDamageInstance, particleEvents, removeParticleEvent } = useCombatStore();

  return (
    <div className="relative h-full overflow-hidden bg-gradient-to-b from-[#9bd4ff] via-[#e7d2b4] to-[#d4c2a1]">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 right-0 h-14 bg-gradient-to-b from-[#6c4e34] to-[#3e2b1c] border-b-2 border-[#c9a46a] shadow-[0_6px_8px_rgba(0,0,0,0.35)]" />
        <div className="absolute top-2 left-6 w-20 h-6 bg-[#b07a4a] rounded-full opacity-50" />
        <div className="absolute top-6 right-10 w-24 h-8 bg-[#b07a4a] rounded-full opacity-40" />
        <div className="absolute inset-x-0 top-16 h-6 bg-gradient-to-r from-[#5a3a21] via-[#7a522f] to-[#5a3a21] opacity-70" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#b08a60] via-[#d2b58a] to-transparent" />
        <div className="absolute bottom-8 left-0 right-0 h-10 bg-[#8f6b45] opacity-70" />
        <div className="absolute bottom-3 left-8 right-8 h-6 bg-[#a67a4f] opacity-60 rounded-full blur-sm" />
      </div>

      <div className="relative z-10 h-full flex flex-col justify-between">
        <div className="absolute left-2 top-20 flex flex-col gap-1.5 z-20">
          {[
            { icon: Trophy, label: 'Rank' },
            { icon: ScrollText, label: 'Quest' },
            { icon: Map, label: 'Map' },
          ].map(({ icon: Icon, label }) => (
            <button
              key={label}
              className="w-9 h-9 rounded-xl bg-gradient-to-b from-[#7f5a39] to-[#5a3d25] border-2 border-[#d2b07a] shadow-[0_4px_8px_rgba(0,0,0,0.25)] flex items-center justify-center text-[#ffd27a] hover:brightness-110 active:scale-95 transition-all"
              aria-label={label}
            >
              <Icon size={14} />
            </button>
          ))}
        </div>

        <div className="absolute right-2 top-20 flex flex-col gap-1.5 z-20">
          {[
            { icon: Gift, label: 'Gift' },
            { icon: ScrollText, label: 'Log' },
          ].map(({ icon: Icon, label }) => (
            <button
              key={label}
              className="w-9 h-9 rounded-xl bg-gradient-to-b from-[#7f5a39] to-[#5a3d25] border-2 border-[#d2b07a] shadow-[0_4px_8px_rgba(0,0,0,0.25)] flex items-center justify-center text-[#ffd27a] hover:brightness-110 active:scale-95 transition-all"
              aria-label={label}
            >
              <Icon size={14} />
            </button>
          ))}
        </div>
        <div className="flex items-center justify-between px-4 pt-2">
          <div className="flex items-center gap-2 bg-gradient-to-b from-[#5a3a21] to-[#3f2a18] text-white text-[10px] font-bold px-2 py-1 rounded-full border border-[#c9a46a] shadow-md">
            <span className="text-[#ffd27a]">⚔️</span>
            <span>Challenge</span>
          </div>
          <div className="flex items-center gap-2">
            {autoFight && (
              <div className="bg-gradient-to-b from-[#ffb15a] to-[#d46b2a] text-[#2b1f14] text-[9px] font-black px-2 py-0.5 rounded-full border border-[#ffd9a3] shadow-md">
                AUTO
              </div>
            )}
            <div className="bg-gradient-to-b from-[#d2a15b] to-[#a86c2a] text-white text-[10px] font-black px-3 py-1 rounded-full border-2 border-[#f0d08a] shadow-md">
              Stage
            </div>
            <div className="bg-[#2b1f14] text-white text-sm font-black px-3 py-1 rounded-full border-2 border-[#c9a46a] shadow-md">
              {enemy ? enemy.level : '--'}
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-center items-center px-4 py-3">
          <div className="w-full max-w-md rounded-2xl bg-gradient-to-b from-[#f0d8b0] to-[#c8a06b] border-2 border-[#f0d08a] shadow-[0_6px_12px_rgba(0,0,0,0.3)] p-3 relative">
            <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-[#5a3d25] border border-[#d2b07a]"></div>
            <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#5a3d25] border border-[#d2b07a]"></div>
            <div className="absolute bottom-2 left-2 w-2 h-2 rounded-full bg-[#5a3d25] border border-[#d2b07a]"></div>
            <div className="absolute bottom-2 right-2 w-2 h-2 rounded-full bg-[#5a3d25] border border-[#d2b07a]"></div>
            <div className="flex justify-between items-center">
            <div className="flex flex-col items-center">
              <div className="relative mb-2">
                <div className="w-24 h-24 relative">
                  <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-16 h-4 bg-black/20 rounded-full blur-sm" />
                  <div className="absolute inset-0 rounded-full border-4 border-[#f0d08a] bg-gradient-to-br from-[#7fd18a] to-[#2f8f5a] shadow-[0_0_16px_rgba(0,0,0,0.3)] flex items-center justify-center text-4xl">
                    🍄
                  </div>
                </div>
              </div>

              <div className="w-28">
                <AnimatedHPBar
                  current={currentHp.div(playerStats['HP'].max(1)).times(100).toNumber()}
                  max={100}
                  className="w-full h-3 bg-gradient-to-r from-[#4c1d1d] to-[#6a2525] border border-[#2a0f0f] shadow-md"
                  indicatorClassName="bg-gradient-to-r from-[#6ee7a8] via-[#4fd08a] to-[#6ee7a8]"
                />
              </div>
              <div className="text-[9px] font-bold text-white mt-1 drop-shadow-md">
                {formatNumber(currentHp)} / {formatNumber(playerStats['HP'])}
              </div>
            </div>

            <div className="flex flex-col items-center">
              <div className="text-xl font-black text-[#c4372d] drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] animate-pulse">
                VS
              </div>
              {autoFight && (
                <div className="mt-1 text-[8px] bg-[#d67a2d] text-white px-2 py-0.5 rounded-full font-bold shadow-md">
                  AUTO
                </div>
              )}
            </div>

            <div className="flex flex-col items-center">
              {enemy ? (
                <>
                  <div className="relative mb-2">
                    <div className="w-24 h-24 relative">
                      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-16 h-4 bg-black/20 rounded-full blur-sm" />
                      <div className="absolute inset-0 rounded-full border-4 border-[#f0d08a] bg-gradient-to-br from-[#ff8585] to-[#c53a3a] shadow-[0_0_16px_rgba(0,0,0,0.3)] flex items-center justify-center text-4xl animate-bounce-slow">
                        👹
                      </div>
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap">
                        <div className="bg-black/70 text-white text-[9px] px-2 py-0.5 rounded-full font-bold border border-white/20">
                          {enemy.name}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="w-28">
                    <AnimatedHPBar
                      current={enemy.currentHp.div(enemy.maxHp).times(100).toNumber()}
                      max={100}
                      className="w-full h-3 bg-gradient-to-r from-[#3b3b3b] to-[#5a5a5a] border border-[#1f1f1f] shadow-md"
                      indicatorClassName="bg-gradient-to-r from-[#ff6b6b] via-[#ff4f4f] to-[#ff6b6b]"
                    />
                  </div>
                  <div className="text-[9px] font-bold text-white mt-1 drop-shadow-md">
                    {formatNumber(enemy.currentHp)} / {formatNumber(enemy.maxHp)}
                  </div>
                </>
              ) : (
                <div className="w-24 h-24 flex items-center justify-center text-gray-400 text-xs animate-pulse">
                  Loading...
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

        {damageInstances.map((instance) => (
          <FloatingDamageNumber
            key={instance.id}
            damage={instance.damage}
            x={instance.x}
            y={instance.y}
            isCritical={instance.isCritical}
            isHeal={false}
            createdAt={instance.createdAt}
            onComplete={() => removeDamageInstance(instance.id)}
          />
        ))}

        {particleEvents.map((event) => (
          <ParticleEffect
            key={event.id}
            x={event.x}
            y={event.y}
            count={event.type === 'critical' ? 20 : 10}
            colors={
              event.type === 'critical'
                ? ['#FFD700', '#FFA500', '#FF4500']
                : event.type === 'heal'
                ? ['#00FF00', '#32CD32', '#90EE90']
                : ['#FF6347', '#FF4500', '#DC143C']
            }
            duration={event.type === 'critical' ? 1200 : 800}
            onComplete={() => removeParticleEvent(event.id)}
          />
        ))}
      </div>
    </div>
  );
};
