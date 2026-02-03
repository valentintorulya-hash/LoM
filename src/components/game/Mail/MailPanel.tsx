import React from 'react';
import { Gift, Mail } from 'lucide-react';
import { useMailStore } from '../../../store/mailStore';
import { formatNumber } from '../../../lib/formatters';
import { OverlayPanel } from '../../layout/OverlayPanel';

interface MailPanelProps {
  onClose: () => void;
}

export const MailPanel: React.FC<MailPanelProps> = ({ onClose }) => {
  const { mails, claimMail, claimAll } = useMailStore();
  const unclaimed = mails.filter((mail) => !mail.claimed).length;

  return (
    <OverlayPanel title="Mail" onClose={onClose}>
      <div className="space-y-3">
        {mails.map((mail) => (
          <div key={mail.id} className="rounded-xl border-2 border-[#d2b07a] bg-gradient-to-b from-[#f9e8cc] to-[#d7b483] p-3 shadow-inner">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="text-[11px] font-black text-[#5a3d25] flex items-center gap-2">
                  <Mail size={12} className="text-[#d49a47]" />
                  {mail.title}
                </div>
                <div className="text-[10px] text-[#6a5a44]">{mail.body}</div>
              </div>
              <button
                onClick={() => claimMail(mail.id)}
                disabled={mail.claimed}
                className={`px-3 py-1 rounded-lg text-[9px] font-black border-2 transition-all
                  ${!mail.claimed
                    ? 'bg-gradient-to-b from-[#6ee7a8] to-[#2f8f5a] text-[#0f3d2b] border-[#b7f0d3]'
                    : 'bg-gray-400 text-gray-600 border-gray-500'
                  }
                `}
              >
                {mail.claimed ? 'Claimed' : 'Claim'}
              </button>
            </div>

            <div className="mt-2 flex items-center gap-2 text-[9px] font-bold text-[#5a3d25]">
              <Gift size={12} className="text-[#d49a47]" />
              <span>+{formatNumber(mail.rewardGold)} Gold</span>
              {mail.rewardLamps.gt(0) && <span>+{formatNumber(mail.rewardLamps)} Lamps</span>}
              {mail.rewardDiamonds.gt(0) && <span>+{formatNumber(mail.rewardDiamonds)} Diamonds</span>}
            </div>
          </div>
        ))}

        <button
          onClick={claimAll}
          disabled={unclaimed === 0}
          className={`w-full py-2 rounded-xl text-[10px] font-black border-2 shadow-md
            ${unclaimed > 0
              ? 'bg-gradient-to-b from-[#ffd27a] to-[#d49a47] text-[#4a2f1a] border-[#fff2cc]'
              : 'bg-gray-400 text-gray-600 border-gray-500'
            }
          `}
        >
          Claim All
        </button>
      </div>
    </OverlayPanel>
  );
};
