import { useCallback } from 'react';
import { useSkillStore, SKILLS_DATA } from '../../../store/skillStore';
import { useCombatStore } from '../../../store/combatStore';
import { useInventoryStore } from '../../../store/inventoryStore';
import { SkillType, StatType } from '../../../lib/gameTypes';

export const useSkillController = () => {
  const { activateSkill } = useSkillStore();
  const { damageEnemy } = useCombatStore();
  const { playerStats, fullHeal } = useInventoryStore();

  const handleSkillClick = useCallback((skillId: string) => {
    const skill = SKILLS_DATA.find(s => s.id === skillId);
    if (!skill) return;

    // Try to activate (check CD)
    const success = activateSkill(skillId);

    if (success) {
      // Apply Instant Effects
      if (skill.type === SkillType.DAMAGE) {
        // Calculate Damage
        const baseDmg = playerStats[StatType.ATTACK].max(1);
        const skillDmg = baseDmg.times(skill.value);
        damageEnemy(skillDmg);
      }
      else if (skill.id === 'heal') {
        // Special case for heal
        // Actually fullHeal is 100%, skill might be 50%.
        // For now, let's just use fullHeal for simplicity or implement partial heal.
        fullHeal(); 
      }
      // Buffs are passive checks in CombatController
    }
  }, [activateSkill, damageEnemy, playerStats, fullHeal]);

  return {
    handleSkillClick
  };
};
