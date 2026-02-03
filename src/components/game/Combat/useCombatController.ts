import { useCallback, useEffect } from 'react';
import { useCombatStore } from '../../../store/combatStore';
import { useInventoryStore } from '../../../store/inventoryStore';
import { useGameStore } from '../../../store/gameStore';
import { useSkillStore, SKILLS_DATA } from '../../../store/skillStore';
import { usePetStore } from '../../../store/petStore';
import { useSkillController } from './useSkillController';
import { StatType } from '../../../lib/gameTypes';
import { Decimal } from '../../../lib/decimal';

const TICK_RATE = 1000; // 1 second per turn for now

export const useCombatController = () => {
  const { enemy, spawnEnemy, damageEnemy, nextStage, previousStage, autoFight, stage } = useCombatStore();
  const { playerStats, currentHp, takeDamage, fullHeal } = useInventoryStore();
  const { addResource, onEnemyDefeated } = useGameStore();
  const { getBuffMultiplier, isReady } = useSkillStore();
  const { handleSkillClick } = useSkillController();
  const { getPetBonus } = usePetStore();

  const handlePlayerAttack = useCallback(() => {
    if (!enemy) return;
    // Player DMG = Attack * Multipliers
    let damage = playerStats[StatType.ATTACK].max(1);
    
    // Apply Rage Buff
    const rageMult = getBuffMultiplier('rage');
    if (rageMult > 1) {
      damage = damage.times(rageMult);
    }

    // Apply Pet Attack Bonus
    const petAtkBonus = getPetBonus('Attack');
    if (petAtkBonus > 0) {
      damage = damage.times(1 + petAtkBonus);
    }

    damageEnemy(damage);
  }, [enemy, playerStats, damageEnemy, getBuffMultiplier, getPetBonus]);

  const handleEnemyAttack = useCallback(() => {
    if (!enemy) return;
    // Enemy DMG = Enemy Atk - Player Def
    const defense = playerStats[StatType.DEFENSE];
    let damage = enemy.attack.minus(defense);
    if (damage.lt(1)) damage = new Decimal(1);

    takeDamage(damage);
  }, [enemy, playerStats, takeDamage]);

  const handleEnemyDeath = useCallback(() => {
    if (!enemy) return;
    
    // Rewards + Pet Gold Bonus
    let gold = enemy.rewards.gold;
    const petGoldBonus = getPetBonus('Gold');
    if (petGoldBonus > 0) {
      gold = gold.times(1 + petGoldBonus);
    }

    if (gold.gt(0)) addResource('gold', gold);
    
    // Trigger RNG Drop
    onEnemyDefeated();

    nextStage();
  }, [enemy, addResource, nextStage, onEnemyDefeated, getPetBonus]);

  const handlePlayerDeath = useCallback(() => {
    previousStage(); 
    fullHeal();
  }, [previousStage, fullHeal]);

  // Main Loop
  useEffect(() => {
    if (!autoFight) return;
    if (!enemy) {
      spawnEnemy();
      return;
    }

    const interval = setInterval(() => {
      // 1. Player Attacks Enemy
      handlePlayerAttack();
      
      // 2. Enemy Attacks Player (if alive)
      if (enemy.currentHp.gt(0)) {
         handleEnemyAttack();
      }

    }, TICK_RATE);

    return () => clearInterval(interval);
  }, [autoFight, enemy, spawnEnemy, handlePlayerAttack, handleEnemyAttack]);

  // Auto-cast skills during auto fight
  useEffect(() => {
    if (!autoFight) return;

    const interval = setInterval(() => {
      SKILLS_DATA.forEach((skill) => {
        if (stage < skill.unlockStage) return;
        if (isReady(skill.id)) {
          handleSkillClick(skill.id);
        }
      });
    }, 400);

    return () => clearInterval(interval);
  }, [autoFight, stage, isReady, handleSkillClick]);

  // Check state changes (Death)
  useEffect(() => {
    if (enemy && enemy.currentHp.lte(0)) {
      handleEnemyDeath();
    }
    if (currentHp.lte(0)) {
      handlePlayerDeath();
    }
  }, [enemy, currentHp, handleEnemyDeath, handlePlayerDeath]);

  // Initial spawn
  useEffect(() => {
    if (!enemy) spawnEnemy();
  }, [enemy, spawnEnemy]);

  return {
    stage,
    enemy,
    playerStats,
    currentHp,
    autoFight,
  };
};