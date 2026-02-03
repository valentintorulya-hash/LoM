import React, { useEffect, useState } from 'react';
import { Progress } from './progress';
import { cn } from '@/lib/utils';

interface AnimatedHPBarProps {
  current: number;
  max: number;
  className?: string;
  indicatorClassName?: string;
  showPulse?: boolean; // Pulse when HP is low
}

export const AnimatedHPBar: React.FC<AnimatedHPBarProps> = ({
  current,
  max,
  className,
  indicatorClassName,
  showPulse = true,
}) => {
  const [prevHP, setPrevHP] = useState(current);
  const [isShaking, setIsShaking] = useState(false);
  
  const percentage = max > 0 ? (current / max) * 100 : 0;
  const isLowHP = percentage < 30;
  const isCriticalHP = percentage < 15;

  useEffect(() => {
    // Trigger shake animation when HP decreases
    if (current < prevHP) {
      setIsShaking(true);
      const timer = setTimeout(() => setIsShaking(false), 500);
      return () => clearTimeout(timer);
    }
    setPrevHP(current);
  }, [current, prevHP]);

  return (
    <div className={cn('relative', isShaking && 'animate-[shake_0.5s_cubic-bezier(.36,.07,.19,.97)]')}>
      <Progress
        value={percentage}
        className={cn(
          'transition-all duration-300',
          showPulse && isLowHP && 'animate-pulse',
          className
        )}
        indicatorClassName={cn(
          'transition-all duration-500',
          isCriticalHP && 'animate-pulse',
          indicatorClassName
        )}
      />
      
      {/* Glow effect when critical HP */}
      {isCriticalHP && (
        <div className="absolute inset-0 rounded-full bg-red-500/30 blur-sm animate-pulse pointer-events-none"></div>
      )}
    </div>
  );
};
