import React from 'react';
import { OverlayPanel } from './OverlayPanel';

interface OverlayPlaceholderProps {
  title: string;
  onClose: () => void;
}

export const OverlayPlaceholder: React.FC<OverlayPlaceholderProps> = ({ title, onClose }) => {
  return (
    <OverlayPanel title={title} onClose={onClose}>
      <div className="text-center text-[11px] text-[#6a5a44] italic">
        This feature is coming soon.
      </div>
    </OverlayPanel>
  );
};
