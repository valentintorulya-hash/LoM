import { useEffect, useRef } from 'react';
import { useGameStore } from '../store/gameStore';
import { usePetStore } from '../store/petStore';

export const useGameLoop = () => {
  const { generateIdleLamps, lampsPerMinute } = useGameStore();
  const { getPetBonus } = usePetStore();
  const lastTickRef = useRef(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const deltaMs = now - lastTickRef.current;
      const deltaSeconds = deltaMs / 1000;
      
      // Calculate effective rate: Base + Bonus
      const bonusRate = getPetBonus('Lamps');
      const effectiveRate = lampsPerMinute.plus(bonusRate);
      
      generateIdleLamps(deltaSeconds, effectiveRate);
      
      lastTickRef.current = now;
    }, 1000); // 1 second tick

    return () => clearInterval(interval);
  }, [generateIdleLamps, lampsPerMinute, getPetBonus]);
};
