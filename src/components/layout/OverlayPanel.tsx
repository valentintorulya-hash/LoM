import React from 'react';
import { X } from 'lucide-react';

interface OverlayPanelProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

export const OverlayPanel: React.FC<OverlayPanelProps> = ({ title, onClose, children }) => {
  return (
    <div className="w-full max-w-[440px] rounded-2xl border-2 border-[#f0d08a] bg-gradient-to-b from-[#f7e7cc] to-[#d7b483] shadow-[0_10px_20px_rgba(0,0,0,0.35)] overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-b from-[#7f5a39] to-[#5a3d25] border-b-2 border-[#d2b07a]">
        <div className="text-[12px] font-black uppercase tracking-wider text-[#ffe9bf]">{title}</div>
        <button
          onClick={onClose}
          className="w-7 h-7 rounded-full bg-gradient-to-br from-[#514539] to-[#3a2f26] border border-[#c9a46a] flex items-center justify-center text-[#ffe6b0] hover:brightness-110"
          aria-label="Close"
        >
          <X size={14} />
        </button>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
};
