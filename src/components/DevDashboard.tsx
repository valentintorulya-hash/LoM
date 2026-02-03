import React from 'react';
import { useGameStore } from '../store/gameStore';
import { useInventoryStore } from '../store/inventoryStore';
import { useLampController } from './game/Lamp/useLampController';
import { useCombatController } from './game/Combat/useCombatController';
import { Decimal } from '../lib/decimal';
import { ItemSlot } from '../lib/gameTypes';

const DevDashboard: React.FC = () => {
  const { currencies, lamp, addResource } = useGameStore();
  const { currentItem, equipped, playerStats, currentHp } = useInventoryStore();
  const { rubLamp, sellItem, equipItem, isAutoMode, toggleAutoMode } = useLampController();
  const { enemy, stage, autoFight } = useCombatController();

  const fmt = (val: Decimal) => val ? val.toStringWithDecimalPlaces(0) : '0';

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Common': return 'text-gray-400';
      case 'Uncommon': return 'text-green-400';
      case 'Rare': return 'text-blue-400';
      case 'Epic': return 'text-purple-400';
      case 'Legendary': return 'text-orange-400';
      case 'Mythic': return 'text-red-500 animate-pulse';
      default: return 'text-white';
    }
  };

  return (
    <div className="p-8 bg-gray-900 min-h-screen text-white font-mono">
      <h1 className="text-3xl font-bold mb-8 text-yellow-500">MyHeroIdleRPG - Dev Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* --- COLUMN 1: RESOURCES & LAMP --- */}
        <div className="space-y-6">
          <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
            <h2 className="text-xl font-bold mb-4 text-blue-400">Resources</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>💡 Lamps:</span>
                <span className="font-bold">{fmt(currencies.lamps)}</span>
              </div>
              <div className="flex justify-between">
                <span>💰 Gold:</span>
                <span className="font-bold">{fmt(currencies.gold)}</span>
              </div>
              <div className="flex justify-between">
                <span>💎 Diamonds:</span>
                <span className="font-bold">{fmt(currencies.diamonds)}</span>
              </div>
            </div>
            <button 
              onClick={() => addResource('lamps', 100)}
              className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
            >
              CHEAT: +100 Lamps
            </button>
          </div>

          <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
            <h2 className="text-xl font-bold mb-4 text-purple-400">Magic Lamp</h2>
            <div className="mb-4">
              <div>Level: <span className="text-green-400 text-2xl">{lamp.level}</span></div>
              <div className="text-sm text-gray-400">
                Activations: {lamp.progress} / {lamp.toNextLevel}
              </div>
              
              <div className="w-full bg-gray-700 h-2 rounded mt-2">
                <div 
                  className="bg-purple-500 h-2 rounded transition-all duration-300"
                  style={{ width: `${(lamp.progress / lamp.toNextLevel) * 100}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={rubLamp}
                disabled={isAutoMode || currencies.lamps.lt(1) || !!currentItem}
                className={`w-full py-4 text-xl font-bold rounded shadow-lg transition-transform active:scale-95 col-span-2
                  ${(isAutoMode || currencies.lamps.lt(1) || !!currentItem) 
                    ? 'bg-gray-600 cursor-not-allowed opacity-50' 
                    : 'bg-yellow-500 hover:bg-yellow-400 text-black'}`}
              >
                {currentItem ? 'Item Pending...' : 'RUB LAMP (-1 💡)'}
              </button>
              
              <button
                onClick={toggleAutoMode}
                className={`w-full py-2 font-bold rounded shadow-lg col-span-2
                  ${isAutoMode 
                    ? 'bg-red-500 hover:bg-red-400 animate-pulse' 
                    : 'bg-green-600 hover:bg-green-500'}`}
              >
                {isAutoMode ? 'STOP AUTO' : 'START AUTO'}
              </button>
            </div>
          </div>
        </div>

        {/* --- COLUMN 2: COMBAT & ACTION --- */}
        <div className="space-y-6">
          {/* COMBAT PANEL */}
          <div className="bg-gray-800 p-4 rounded-lg border border-red-900/50 shadow-inner relative overflow-hidden">
             <div className="absolute top-0 right-0 p-2 opacity-50 text-xs">Stage {stage}</div>
             <h2 className="text-xl font-bold mb-4 text-red-500 flex items-center gap-2">
               ⚔️ Combat
               {autoFight && <span className="text-xs bg-red-600 text-white px-2 py-0.5 rounded animate-pulse">AUTO</span>}
             </h2>
             
             {enemy ? (
               <div className="text-center">
                 <div className="text-2xl font-bold text-red-300 mb-2">{enemy.name}</div>
                 <div className="relative w-full h-6 bg-gray-700 rounded-full overflow-hidden border border-gray-600">
                    <div 
                      className="absolute top-0 left-0 h-full bg-red-600 transition-all duration-200"
                      style={{ width: `${enemy.currentHp.div(enemy.maxHp).times(100).toNumber()}%` }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white shadow-black drop-shadow-md">
                      {fmt(enemy.currentHp)} / {fmt(enemy.maxHp)} HP
                    </div>
                 </div>
                 <div className="mt-4 flex justify-between text-sm text-gray-400">
                    <div>Attack: {fmt(enemy.attack)}</div>
                    <div>Reward: {fmt(enemy.rewards.gold)} Gold</div>
                 </div>
               </div>
             ) : (
               <div className="text-center py-8 text-gray-500">
                 No Enemy... Spawning?
               </div>
             )}
          </div>

          <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 min-h-[300px] flex flex-col items-center justify-center relative">
            {isAutoMode && (
              <div className="absolute top-2 right-2 text-xs bg-red-500 px-2 py-1 rounded animate-pulse">
                AUTO MODE ACTIVE
              </div>
            )}
            
            <h2 className="text-xl font-bold mb-4 text-orange-400 self-start w-full">Current Drop</h2>
            
            {currentItem ? (
              <div className="w-full text-center animate-pulse">
                <div className={`text-2xl font-bold mb-2 ${getRarityColor(currentItem.rarity)}`}>
                  {currentItem.name}
                </div>
                <div className="text-gray-300 mb-1">Slot: {currentItem.slot}</div>
                <div className="text-gray-300 mb-1">Level: {currentItem.level}</div>
                <div className="bg-black/30 p-2 rounded my-4 inline-block min-w-[200px]">
                  <div className="text-green-400 font-bold text-lg">
                    {currentItem.mainStat.type}: {fmt(currentItem.mainStat.value)}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-4 w-full px-4">
                  <button
                    onClick={sellItem}
                    disabled={isAutoMode}
                    className="bg-red-600 hover:bg-red-700 py-3 rounded text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    SELL (+{fmt(currentItem.sellPrice)}💰)
                  </button>
                  <button
                    onClick={equipItem}
                    disabled={isAutoMode}
                    className="bg-green-600 hover:bg-green-700 py-3 rounded text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    EQUIP
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-gray-500 text-center">
                <div className="text-6xl mb-4">🎲</div>
                <p>Rub the lamp to get loot!</p>
              </div>
            )}
          </div>
          
          <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
             <h2 className="text-xl font-bold mb-4 text-white">Player Stats</h2>
             
             {/* Player HP Bar */}
             <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                   <span className="text-red-400">HP</span>
                   <span>{fmt(currentHp)} / {fmt(playerStats['HP'])}</span>
                </div>
                <div className="w-full bg-gray-700 h-3 rounded overflow-hidden">
                   <div 
                      className="bg-red-500 h-full transition-all duration-300"
                      style={{ width: `${currentHp.div(playerStats['HP'].max(1)).times(100).toNumber()}%` }}
                   />
                </div>
             </div>

             <div className="grid grid-cols-2 gap-2">
                {Object.entries(playerStats).map(([key, val]) => (
                  <div key={key} className="flex justify-between border-b border-gray-700 pb-1">
                    <span className="text-gray-400">{key}</span>
                    <span className="font-bold text-white">{fmt(val)}</span>
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* --- COLUMN 3: INVENTORY (EQUIPPED) --- */}
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 h-full">
          <h2 className="text-xl font-bold mb-4 text-green-400">Equipped Gear</h2>
          <div className="space-y-3">
            {['Weapon', 'Helmet', 'Armor', 'Boots', 'Ring', 'Amulet'].map((slot) => {
              const item = equipped[slot as ItemSlot];
              return (
                <div key={slot} className="border border-gray-600 rounded p-3 bg-gray-900/50 flex justify-between items-center">
                  <div>
                    <div className="text-xs text-gray-500 uppercase">{slot}</div>
                    {item ? (
                      <>
                        <div className={`font-bold ${getRarityColor(item.rarity)}`}>{item.name}</div>
                        <div className="text-xs text-gray-400">Lvl {item.level}</div>
                      </>
                    ) : (
                      <div className="text-gray-600 italic">Empty</div>
                    )}
                  </div>
                  {item && (
                    <div className="text-right">
                      <div className="text-green-400 font-bold">{fmt(item.mainStat.value)}</div>
                      <div className="text-xs text-gray-500">{item.mainStat.type}</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DevDashboard;
