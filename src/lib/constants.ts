export const RARITY_CONFIG = {
  Common: {
    color: 'text-gray-400',
    borderColor: 'border-gray-400',
    bgGlow: 'shadow-gray-400/20',
    weight: 1000,
    multiplier: 1,
  },
  Uncommon: {
    color: 'text-green-400',
    borderColor: 'border-green-400',
    bgGlow: 'shadow-green-400/20',
    weight: 500,
    multiplier: 1.5,
  },
  Rare: {
    color: 'text-blue-400',
    borderColor: 'border-blue-400',
    bgGlow: 'shadow-blue-400/20',
    weight: 250,
    multiplier: 2.5,
  },
  Epic: {
    color: 'text-purple-400',
    borderColor: 'border-purple-400',
    bgGlow: 'shadow-purple-400/30',
    weight: 100,
    multiplier: 4.0,
  },
  Legendary: {
    color: 'text-yellow-400',
    borderColor: 'border-yellow-400',
    bgGlow: 'shadow-yellow-400/50',
    weight: 25,
    multiplier: 8.0,
  },
  Mythic: {
    color: 'text-red-500',
    borderColor: 'border-red-500',
    bgGlow: 'shadow-red-500/60',
    weight: 5,
    multiplier: 15.0,
  },
} as const;

export const ITEM_NAMES = {
  Weapon: ['Sword', 'Blade', 'Axe', 'Dagger', 'Spear'],
  Helmet: ['Helm', 'Casque', 'Visor', 'Hood', 'Crown'],
  Armor: ['Plate', 'Mail', 'Robe', 'Tunic', 'Vest'],
  Boots: ['Greaves', 'Boots', 'Shoes', 'Sandals', 'Treads'],
  Gloves: ['Gauntlets', 'Gloves', 'Bracers', 'Mitts', 'Wraps'],
  Pants: ['Leggings', 'Pants', 'Trousers', 'Greaves', 'Chaps'],
  Ring1: ['Ring', 'Band', 'Signet', 'Loop', 'Coil'],
  Ring2: ['Ring', 'Band', 'Signet', 'Loop', 'Coil'],
  Amulet: ['Amulet', 'Necklace', 'Charm', 'Talisman', 'Pendant'],
  Bracelet: ['Bracelet', 'Bangle', 'Cuff', 'Wristband', 'Armlet'],
  Belt: ['Belt', 'Sash', 'Girdle', 'Waistband', 'Cincture'],
  Cape: ['Cape', 'Cloak', 'Mantle', 'Shawl', 'Shroud'],
};
