import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Decimal } from '../lib/decimal';
import { useGameStore } from './gameStore';

export interface MailItem {
  id: string;
  title: string;
  body: string;
  rewardGold: Decimal;
  rewardLamps: Decimal;
  rewardDiamonds: Decimal;
  claimed: boolean;
}

interface MailState {
  mails: MailItem[];
  claimMail: (id: string) => void;
  claimAll: () => void;
}

const DEFAULT_MAIL: MailItem[] = [
  {
    id: 'mail-1',
    title: 'Welcome Gift',
    body: 'Thanks for joining! Here is a small gift to get started.',
    rewardGold: new Decimal(500),
    rewardLamps: new Decimal(2),
    rewardDiamonds: new Decimal(2),
    claimed: false,
  },
  {
    id: 'mail-2',
    title: 'Daily Reward',
    body: 'Daily login reward. Keep coming back!',
    rewardGold: new Decimal(300),
    rewardLamps: new Decimal(1),
    rewardDiamonds: new Decimal(0),
    claimed: false,
  },
];

export const useMailStore = create<MailState>()(
  persist(
    (set, get) => ({
      mails: DEFAULT_MAIL,

      claimMail: (id) => {
        const mail = get().mails.find((item) => item.id === id);
        if (!mail || mail.claimed) return;

        const { addResource } = useGameStore.getState();
        if (mail.rewardGold.gt(0)) addResource('gold', mail.rewardGold);
        if (mail.rewardLamps.gt(0)) addResource('lamps', mail.rewardLamps);
        if (mail.rewardDiamonds.gt(0)) addResource('diamonds', mail.rewardDiamonds);

        set((state) => ({
          mails: state.mails.map((item) =>
            item.id === id ? { ...item, claimed: true } : item
          ),
        }));
      },

      claimAll: () => {
        get().mails.forEach((mail) => {
          if (!mail.claimed) {
            get().claimMail(mail.id);
          }
        });
      },
    }),
    {
      name: 'mail-storage',
    }
  )
);
