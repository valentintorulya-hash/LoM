import React, { useEffect, useRef, useState } from 'react';
import { formatNumber } from '../../lib/formatters';
import type { Decimal } from '../../lib/decimal';

interface FloatingDamageNumberProps {
  damage: Decimal;
  x: number;
  y: number;
  isCritical?: boolean;
  isHeal?: boolean;
  onComplete?: () => void;
  createdAt: number;
}

export const FloatingDamageNumber: React.FC<FloatingDamageNumberProps> = ({
  damage,
  x,
  y,
  isCritical = false,
  isHeal = false,
  onComplete,
  createdAt,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const jitterRef = useRef({ x: 0, y: 0 });
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      setIsVisible(false);
      onCompleteRef.current?.();
    }, 1000);

    return () => clearTimeout(timer);
  }, [createdAt]);

  if (!isVisible) return null;

  const baseClasses = "absolute pointer-events-none font-black drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] transition-all duration-1000";
  const colorClasses = isHeal 
    ? "text-green-400" 
    : isCritical 
    ? "text-yellow-300 text-3xl" 
    : "text-red-500 text-2xl";
  
  const animation = isCritical 
    ? "animate-[float-crit_1s_ease-out]" 
    : "animate-[float-damage_1s_ease-out]";

  return (
    <div
      className={`${baseClasses} ${colorClasses} ${animation}`}
      style={{
        left: `${x + jitterRef.current.x}px`,
        top: `${y + jitterRef.current.y}px`,
        transform: 'translate(-50%, -50%)',
        zIndex: isCritical ? 40 : 30,
      }}
    >
      {isHeal ? '+' : '-'}{formatNumber(damage)}
      {isCritical && (
        <span className="text-base ml-1 text-orange-400">CRIT!</span>
      )}
    </div>
  );
};
