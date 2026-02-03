import { Decimal } from './decimal';

const POSTFIXES = ['', 'K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No', 'Dc'];

export const formatNumber = (value: Decimal | number): string => {
  const decimal = new Decimal(value);

  if (decimal.eq(0)) return '0';
  if (decimal.lt(1)) return decimal.toFixed(2); // Small decimals
  if (decimal.lt(1000)) return decimal.toFixed(0); // 0 - 999

  // For larger numbers, use K, M, B, etc.
  const power = Math.floor(decimal.log10());
  const tier = Math.floor(power / 3);

  if (tier < POSTFIXES.length) {
    const scale = decimal.div(Decimal.pow(10, tier * 3));
    return `${scale.toFixed(1)}${POSTFIXES[tier]}`;
  }

  // Fallback to scientific for super huge numbers
  return decimal.toExponential(2).replace('+', '');
};
