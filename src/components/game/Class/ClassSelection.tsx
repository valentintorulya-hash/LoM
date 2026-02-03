import React, { useState } from 'react';
import { Shield, Zap, Target, Check, AlertCircle, Lock } from 'lucide-react';
import { useClassStore, CLASSES, type ClassId } from '../../../store/classStore';
import { useGameStore } from '../../../store/gameStore';
import { OverlayPanel } from '../../layout/OverlayPanel';

interface ClassSelectionProps {
  onClose: () => void;
}

export const ClassSelection: React.FC<ClassSelectionProps> = ({ onClose }) => {
  const { selectedClassId, selectClass, classLevels } = useClassStore();
  const { playerLevel } = useGameStore();
  const [hoveredClass, setHoveredClass] = useState<ClassId | null>(null);
  const [confirmingClass, setConfirmingClass] = useState<ClassId | null>(null);

  const canSelectClass = playerLevel >= 5;

  const handleSelectClass = (classId: ClassId) => {
    if (!canSelectClass) return;
    
    if (selectedClassId && selectedClassId !== classId) {
      setConfirmingClass(classId);
    } else {
      selectClass(classId);
      onClose();
    }
  };

  const confirmChange = () => {
    if (confirmingClass) {
      selectClass(confirmingClass);
      setConfirmingClass(null);
      onClose();
    }
  };

  const getIcon = (classId: string) => {
    switch (classId) {
      case 'warrior': return <Shield size={24} />;
      case 'mage': return <Zap size={24} />;
      case 'archer': return <Target size={24} />;
      default: return <Shield size={24} />;
    }
  };

  return (
    <OverlayPanel 
      title={selectedClassId ? "Change Class" : "Choose Your Class"} 
      onClose={onClose}
    >
      <div className="space-y-4">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-lg font-black text-[#5a3d25]">
            {selectedClassId ? 'Change Your Path' : 'Select Your Destiny'}
          </h2>
          <p className="text-[10px] text-[#6a5a44] mt-1">
            {selectedClassId 
              ? 'Changing class costs 100 diamonds' 
              : 'Reach level 5 to unlock class selection'}
          </p>
        </div>

        {/* Class Selection */}
        <div className="space-y-3">
          {CLASSES.map((classData) => {
            const isSelected = selectedClassId === classData.id;
            const isHovered = hoveredClass === classData.id;
            const level = classLevels[classData.id];
            const isLocked = !canSelectClass && !selectedClassId;

            return (
              <div
                key={classData.id}
                onMouseEnter={() => setHoveredClass(classData.id)}
                onMouseLeave={() => setHoveredClass(null)}
                className={`
                  rounded-2xl border-2 p-4 transition-all cursor-pointer
                  ${isSelected 
                    ? 'border-[#ffd27a] bg-gradient-to-b from-[#ffd27a]/30 to-[#d49a47]/20' 
                    : isHovered 
                      ? 'border-[#d2b07a] bg-[#f9e8cc]/80 scale-[1.02]' 
                      : 'border-[#d2b07a] bg-gradient-to-b from-[#f9e8cc] to-[#d7b483]'
                  }
                  ${isLocked ? 'opacity-60 cursor-not-allowed' : ''}
                `}
                onClick={() => !isLocked && handleSelectClass(classData.id)}
              >
                <div className="flex items-start gap-3">
                  {/* Class Icon */}
                  <div 
                    className={`
                      w-14 h-14 rounded-xl flex items-center justify-center text-white shadow-lg
                      ${isSelected ? 'ring-2 ring-[#ffd27a]' : ''}
                    `}
                    style={{ background: classData.color }}
                  >
                    {getIcon(classData.id)}
                  </div>

                  {/* Class Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-black text-[#5a3d25] text-base">{classData.name}</h3>
                      {isSelected && (
                        <span className="text-[8px] bg-[#ffd27a] text-[#5a3d25] px-2 py-0.5 rounded-full font-black">
                          SELECTED
                        </span>
                      )}
                      {!isSelected && level > 1 && (
                        <span className="text-[8px] bg-[#6ee7a8] text-[#0f3d2b] px-2 py-0.5 rounded-full font-black">
                          Lv.{level}
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-[#6a5a44] mt-1">{classData.description}</p>
                    
                    {/* Bonuses */}
                    <div className="flex flex-wrap gap-1 mt-2">
                      {classData.bonuses.map((bonus, idx) => (
                        <span 
                          key={idx}
                          className="text-[8px] bg-[#5a3d25]/10 text-[#5a3d25] px-1.5 py-0.5 rounded font-bold"
                        >
                          {bonus}
                        </span>
                      ))}
                    </div>

                    {/* Special Skill */}
                    <div className="mt-3 p-2 rounded-lg bg-black/5 border border-black/10">
                      <div className="flex items-center gap-1 text-[9px] font-bold text-[#5a3d25]">
                        <span>{classData.specialSkill.icon}</span>
                        <span>{classData.specialSkill.name}</span>
                      </div>
                      <p className="text-[8px] text-[#6a5a44] mt-0.5">
                        {classData.specialSkill.description}
                      </p>
                    </div>
                  </div>

                  {/* Selection Indicator */}
                  <div className={`
                    w-6 h-6 rounded-full border-2 flex items-center justify-center
                    ${isSelected 
                      ? 'bg-[#ffd27a] border-[#d49a47]' 
                      : 'border-[#d2b07a]'
                    }
                  `}>
                    {isSelected && <Check size={14} className="text-[#5a3d25]" />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Warning for locked */}
        {!canSelectClass && !selectedClassId && (
          <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-3 flex items-center gap-2">
            <Lock size={16} className="text-red-500" />
            <p className="text-[10px] text-red-600 font-bold">
              Reach level 5 to unlock class selection!
            </p>
          </div>
        )}

        {/* Confirmation Modal */}
        {confirmingClass && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-gradient-to-b from-[#f7e7cc] to-[#d7b483] rounded-2xl border-2 border-[#f0d08a] p-4 max-w-sm w-full">
              <div className="flex items-center gap-2 text-amber-600 mb-3">
                <AlertCircle size={20} />
                <span className="font-black text-sm">Change Class?</span>
              </div>
              <p className="text-[10px] text-[#6a5a44] mb-4">
                Changing your class will cost <span className="font-bold text-[#5a3d25]">100 diamonds</span>. 
                Your class level and experience will be preserved.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setConfirmingClass(null)}
                  className="flex-1 py-2 rounded-xl text-[10px] font-black border-2 bg-gray-400 text-gray-700 border-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmChange}
                  className="flex-1 py-2 rounded-xl text-[10px] font-black border-2 bg-gradient-to-b from-[#ffd27a] to-[#d49a47] text-[#4a2f1a] border-[#fff2cc]"
                >
                  Confirm (100 💎)
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </OverlayPanel>
  );
};
