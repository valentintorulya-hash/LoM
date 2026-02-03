import { useCallback, useEffect } from 'react';
import { useGameStore } from '../../../store/gameStore';
import { useInventoryStore } from '../../../store/inventoryStore';
import { generateItem } from '../../../lib/items';
import type { Item } from '../../../lib/gameTypes';

export const useLampController = () => {
  const {
    spendResource,
    addLampProgress,
    addResource,
    addPlayerExp,
    lamp,
    currencies,
    lampAutoMode,
    lampAutoBatch,
    setLampAutoMode,
    setLampAutoBatch,
    toggleLampAutoMode,
  } = useGameStore();
  const {
    setNewItem,
    discardCurrentItem,
    equipCurrentItem,
    currentItem,
    equipped,
    advanceLootQueue,
    lootQueue,
  } = useInventoryStore();

  const isBetterItem = useCallback((newItem: Item): boolean => {
    const currentEquipped = equipped[newItem.slot];
    if (!currentEquipped) return true;
    return newItem.mainStat.value.gt(currentEquipped.mainStat.value);
  }, [equipped]);

  const rubLamp = useCallback(() => {
    if (currentItem) return;

    const success = spendResource('lamps', 1);
    
    if (success) {
      const newItem = generateItem(lamp.level);
      setNewItem(newItem);
      addLampProgress();
    } else {
      if (lampAutoMode) setLampAutoMode(false);
    }
  }, [spendResource, lamp.level, currentItem, setNewItem, addLampProgress, lampAutoMode, setLampAutoMode]);

  const rubLampBatch = useCallback((count: number, mode: 'manual' | 'auto') => {
    const initialInventoryState = useInventoryStore.getState();
    if (mode === 'manual' && (initialInventoryState.currentItem || initialInventoryState.lootQueue.length > 0)) {
      return;
    }

    let remaining = count;
    let hasPending = false;

    while (remaining > 0) {
      const gameState = useGameStore.getState();
      const inventoryState = useInventoryStore.getState();

      const success = gameState.spendResource('lamps', 1);
      if (!success) break;

      const newItem = generateItem(gameState.lamp.level);
      gameState.addLampProgress();

      const equippedMap = inventoryState.equipped;
      const currentEquipped = equippedMap[newItem.slot];
      const isBetter = !currentEquipped || newItem.mainStat.value.gt(currentEquipped.mainStat.value);

      if (mode === 'manual') {
        if (isBetter) {
          if (!hasPending) {
            inventoryState.setNewItem(newItem);
            hasPending = true;
          } else {
            inventoryState.enqueueLoot(newItem);
          }
        } else {
          gameState.addResource('gold', newItem.sellPrice);
          gameState.addPlayerExp(newItem.expValue);
        }
      } else {
        inventoryState.setNewItem(newItem);
        if (isBetter) {
          const oldItem = inventoryState.equipCurrentItem();
          if (oldItem) gameState.addResource('gold', oldItem.sellPrice);
        } else {
          gameState.addResource('gold', newItem.sellPrice);
          gameState.addPlayerExp(newItem.expValue);
          inventoryState.discardCurrentItem();
        }
      }

      remaining -= 1;
    }
  }, []);

  const sellItem = useCallback(() => {
    if (!currentItem) return;
    addResource('gold', currentItem.sellPrice);
    addPlayerExp(currentItem.expValue);
    discardCurrentItem();
    if (lootQueue.length > 0) {
      advanceLootQueue();
    }
  }, [currentItem, addResource, addPlayerExp, discardCurrentItem, lootQueue.length, advanceLootQueue]);

  const equipItem = useCallback(() => {
    if (!currentItem) return;
    const oldItem = equipCurrentItem();
    if (oldItem) {
      addResource('gold', oldItem.sellPrice);
    }
    if (lootQueue.length > 0) {
      advanceLootQueue();
    }
  }, [currentItem, equipCurrentItem, addResource, lootQueue.length, advanceLootQueue]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (lampAutoMode) {
      interval = setInterval(() => {
        if (!currentItem) {
          if (lampAutoBatch === 10) {
            if (currencies.lamps.gte(10)) {
              rubLampBatch(10, 'auto');
            } else {
              setLampAutoMode(false);
            }
          } else {
            if (currencies.lamps.gte(1)) {
              rubLamp();
            } else {
              setLampAutoMode(false);
            }
          }
          return;
        }

        if (currentItem) {
          if (isBetterItem(currentItem)) {
            equipItem();
          } else {
            sellItem();
          }
        }

      }, 500);
    }

    return () => clearInterval(interval);
  }, [
    lampAutoMode,
    lampAutoBatch,
    currentItem,
    rubLamp,
    rubLampBatch,
    equipItem,
    sellItem,
    currencies.lamps,
    isBetterItem,
    setLampAutoMode,
  ]);

  return {
    rubLamp,
    rubLampBatch,
    sellItem,
    equipItem,
    canRub: !currentItem && currencies.lamps.gte(1),
    isAutoMode: lampAutoMode,
    autoBatch: lampAutoBatch,
    setAutoBatch: setLampAutoBatch,
    toggleAutoMode: toggleLampAutoMode,
  };
};
