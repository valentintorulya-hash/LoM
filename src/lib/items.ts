import { ItemRarity, ItemSlot, StatType } from './gameTypes';
import type { Item, ItemStat } from './gameTypes';
import { RARITY_CONFIG, ITEM_NAMES } from './constants';
import { Decimal } from './decimal';

const generateId = () => Math.random().toString(36).substr(2, 9);
const randomChoice = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

// Base Stats per Slot
const SLOT_BASE_STATS: Record<ItemSlot, { type: StatType; base: number }> = {
  [ItemSlot.WEAPON]: { type: StatType.ATTACK, base: 15 },
  [ItemSlot.HELMET]: { type: StatType.HP, base: 80 },
  [ItemSlot.ARMOR]: { type: StatType.DEFENSE, base: 10 },
  [ItemSlot.BOOTS]: { type: StatType.SPEED, base: 1 },
  [ItemSlot.GLOVES]: { type: StatType.ATTACK, base: 8 },
  [ItemSlot.PANTS]: { type: StatType.HP, base: 60 },
  [ItemSlot.RING1]: { type: StatType.ATTACK, base: 5 },
  [ItemSlot.RING2]: { type: StatType.ATTACK, base: 5 },
  [ItemSlot.AMULET]: { type: StatType.HP, base: 50 },
  [ItemSlot.BRACELET]: { type: StatType.DEFENSE, base: 5 },
  [ItemSlot.BELT]: { type: StatType.HP, base: 40 },
  [ItemSlot.CAPE]: { type: StatType.DEFENSE, base: 8 },
};

const rollRarity = (_lampLevel: number): ItemRarity => {
  // Logic to improve chances based on lamp level could go here.
  // For now, using weighted random from constants.
  const totalWeight = Object.values(RARITY_CONFIG).reduce((a, b) => a + b.weight, 0);
  let randomVal = Math.random() * totalWeight;

  for (const [rarity, config] of Object.entries(RARITY_CONFIG)) {
    if (randomVal < config.weight) return rarity as ItemRarity;
    randomVal -= config.weight;
  }
  return 'Common';
};

export const generateItem = (lampLevel: number): Item => {
  const id = generateId();
  const rarity = rollRarity(lampLevel);
  const slot = randomChoice(Object.values(ItemSlot));
  const config = RARITY_CONFIG[rarity];
  const baseStatConfig = SLOT_BASE_STATS[slot];

  // Name Generation
  const typeName = randomChoice(ITEM_NAMES[slot] || ['Item']);
  const name = `${rarity} ${typeName}`;

  // Stat Calculation
  // Formula: Base * RarityMult * (1.1 ^ (Level - 1))
  const levelGrowth = Decimal.pow(1.1, lampLevel - 1);
  const statValue = new Decimal(baseStatConfig.base)
    .times(config.multiplier)
    .times(levelGrowth)
    .floor();

  const mainStat: ItemStat = {
    type: baseStatConfig.type,
    value: statValue,
  };

  // Sell Price = Level * RarityMult * 10
  const sellPrice = new Decimal(10)
    .times(lampLevel)
    .times(config.multiplier)
    .floor();

  return {
    id,
    name,
    rarity,
    slot,
    level: lampLevel,
    mainStat,
    subStats: [], // TODO: Add substats later
    sellPrice,
    expValue: new Decimal(1),
  };
};
