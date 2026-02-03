import { Decimal } from './decimal';
import type { Enemy } from './gameTypes';

const NAMES = ['Slime', 'Goblin', 'Wolf', 'Orc', 'Skeleton', 'Troll', 'Ogre', 'Dragon'];

const BASE_HP = new Decimal(30); // Was 50
const BASE_ATTACK = new Decimal(2); // Was 5
const BASE_DEFENSE = new Decimal(0);
const BASE_GOLD = new Decimal(10);

const HP_GROWTH = 1.2;
const ATTACK_GROWTH = 1.15;
const REWARD_GROWTH = 1.1;

export const generateEnemy = (stage: number): Enemy => {
  const level = stage;
  const name = NAMES[(stage - 1) % NAMES.length];
  
  // Exponential scaling based on stage
  const scaling = Decimal.pow(HP_GROWTH, stage - 1);
  const atkScaling = Decimal.pow(ATTACK_GROWTH, stage - 1);
  const rewardScaling = Decimal.pow(REWARD_GROWTH, stage - 1);

  const maxHp = BASE_HP.times(scaling).floor();
  const attack = BASE_ATTACK.times(atkScaling).floor();
  const defense = BASE_DEFENSE.times(scaling).floor(); // Currently 0

  const goldReward = BASE_GOLD.times(rewardScaling).floor();

  return {
    id: Math.random().toString(36).substr(2, 9),
    name: `${name} Lvl.${level}`,
    level,
    maxHp,
    currentHp: maxHp,
    attack,
    defense,
    rewards: {
      gold: goldReward
    }
  };
};
