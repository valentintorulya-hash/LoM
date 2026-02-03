import React from 'react';
import { CombatView } from './CombatView';
import { LampAction } from '../game/LampAction';
import { EquipmentGrid } from './EquipmentGrid';
import { ActionButtons } from './ActionButtons';
import { LootToast } from '../game/Gacha/LootToast';
import { useInventoryStore } from '../../store/inventoryStore';
import { useLampController } from '../game/Lamp/useLampController';

export const LampTab: React.FC = () => {
  const { currentItem } = useInventoryStore();
  const { equipItem, sellItem, isAutoMode } = useLampController();

  return (
    <div className="flex flex-col h-full relative overflow-hidden bg-gradient-to-b from-[#f4e4c8] to-[#e0c49a]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,#ffffff66,transparent_35%),radial-gradient(circle_at_80%_20%,#ffffff33,transparent_45%)]" />

      <div className="relative z-10 flex flex-col h-full">
        <div className="px-2 pt-2">
          <div className="rounded-2xl border-2 border-[#f0d08a] bg-gradient-to-b from-[#f9e8cc] to-[#d7b483] shadow-[0_8px_16px_rgba(0,0,0,0.25)] overflow-hidden">
            <div className="h-[30%] min-h-[180px]">
              <CombatView />
            </div>
          </div>
        </div>

        <div className="relative z-20 -mt-3 pt-2 flex justify-center">
          <div className="rounded-full px-4 py-1 bg-gradient-to-b from-[#7f5a39] to-[#5a3d25] border-2 border-[#d2b07a] shadow-[0_4px_10px_rgba(0,0,0,0.25)]">
            <ActionButtons />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-1 py-2 relative z-0 flex flex-col justify-center">
          <div className="relative z-10 scale-95 origin-center">
            <EquipmentGrid />
          </div>
        </div>

        <div className="shrink-0 relative z-20 pb-2 pt-2">
          <div className="mx-2 rounded-2xl border-2 border-[#f0d08a] bg-gradient-to-b from-[#f4e0bb] via-[#e2c08d] to-[#c79c5a] shadow-[0_6px_14px_rgba(0,0,0,0.25)]">
            <LampAction />
          </div>
        </div>
      </div>

      {!isAutoMode && currentItem && (
        <div className="absolute right-2 top-[92px] z-30">
          <LootToast item={currentItem} onEquip={equipItem} onSell={sellItem} />
        </div>
      )}
    </div>
  );
};
