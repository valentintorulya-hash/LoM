import { Decimal } from './decimal';

// --- Enums ---

export const ItemRarity = {
  COMMON: 'Common',
  UNCOMMON: 'Uncommon',
  RARE: 'Rare',
  EPIC: 'Epic',
  LEGENDARY: 'Legendary',
  MYTHIC: 'Mythic',
} as const;
export type ItemRarity = typeof ItemRarity[keyof typeof ItemRarity];

export const ItemSlot = {
  WEAPON: 'Weapon',
  HELMET: 'Helmet',
  ARMOR: 'Armor',
  BOOTS: 'Boots',
  GLOVES: 'Gloves',
  PANTS: 'Pants',
  RING1: 'Ring1',
  RING2: 'Ring2',
  AMULET: 'Amulet',
  BRACELET: 'Bracelet',
  BELT: 'Belt',
  CAPE: 'Cape',
} as const;
export type ItemSlot = typeof ItemSlot[keyof typeof ItemSlot];

export const StatType = {
  ATTACK: 'Attack',
  HP: 'HP',
  DEFENSE: 'Defense',
  SPEED: 'Speed',
} as const;
export type StatType = typeof StatType[keyof typeof StatType];

// --- Interfaces ---

export interface ItemStat {
  type: StatType;
  value: Decimal; // Decimal
}

export interface Item {
  id: string;
  name: string;
  rarity: ItemRarity;
  slot: ItemSlot;
  level: number;
  mainStat: ItemStat;
  subStats: ItemStat[];
  sellPrice: Decimal; // Decimal
  expValue: Decimal;   // Decimal
}

export interface Enemy {
  id: string;
  name: string;
  level: number;
  maxHp: Decimal;
  currentHp: Decimal;
  attack: Decimal;
  defense: Decimal;
  rewards: {
    gold: Decimal;
  };
}

export const SkillType = {
  DAMAGE: 'Damage',
  BUFF: 'Buff',
} as const;
export type SkillType = typeof SkillType[keyof typeof SkillType];

export interface Skill {
  id: string;
  name: string;
  type: SkillType;
  cooldown: number; // ms
  duration?: number; // ms (for buffs)
  value: number; // Multiplier (e.g. 2.5x damage, 1.5x buff)
  unlockStage: number;
  iconId: number; // Mapping to Lucide icon index
}

export interface Pet {
  id: string;
  name: string;
  description: string;
  level: number;
  bonusType: 'Gold' | 'Lamps' | 'Attack' | 'HP';
  bonusValue: number; // Percentage or flat
  icon: string;
  unlockCost: Decimal;
}