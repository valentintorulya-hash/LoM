import React from 'react';
import { LampAction } from '../LampAction';
import { DropRates } from './DropRates';
import { LootToast } from './LootToast';
import { useInventoryStore } from '../../../store/inventoryStore';
import { useLampController } from '../Lamp/useLampController';

export const GachaMachine: React.FC = () => {
  const { currentItem } = useInventoryStore();
  const { equipItem, sellItem, isAutoMode } = useLampController();

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto relative">
      {/* Information Header */}
      <DropRates />

      {/* The Main Interactable */}
      <LampAction />

      {!isAutoMode && currentItem && (
        <div className="absolute right-0 top-6 z-30">
          <LootToast item={currentItem} onEquip={equipItem} onSell={sellItem} />
        </div>
      )}
    </div>
  );
};
