import React from 'react';
import { Star } from 'lucide-react';
import type { ItemRarity } from '../../lib/gameTypes';
import { RARITY_CONFIG } from '../../lib/constants';

interface RarityStarsProps {
  rarity: ItemRarity;
  size?: number;
}

const RARITY_STARS: Record<ItemRarity, number> = {
  'Common': 1,
  'Uncommon': 2,
  'Rare': 3,
  'Epic': 4,
  'Legendary': 5,
  'Mythic': 6,
};

export const RarityStars: React.FC<RarityStarsProps> = ({ rarity, size = 12 }) => {
  const starCount = RARITY_STARS[rarity];
  const config = RARITY_CONFIG[rarity];

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: starCount }).map((_, i) => (
        <Star
          key={i}
          size={size}
          className={`${config?.color} drop-shadow-sm`}
          fill="currentColor"
        />
      ))}
    </div>
  );
};
