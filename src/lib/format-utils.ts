export function formatCurrency(value: number | undefined | null): string {
  const num = Number(value);
  if (!value || isNaN(num)) return '$0';
  
  if (num >= 1000000000) {
    return `$${(num / 1000000000).toFixed(1)}B`;
  }
  if (num >= 1000000) {
    return `$${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `$${(num / 1000).toFixed(1)}K`;
  }
  return `$${num.toFixed(2)}`;
}

export function formatNumber(value: number | undefined | null): string {
  const num = Number(value);
  if (!value || isNaN(num)) return '0';

  if (num >= 1000000000) {
    return `${(num / 1000000000).toFixed(1)}B`;
  }
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toFixed(0);
}

export function formatPercentage(value: number | undefined | null): string {
  const num = Number(value);
  if (!value || isNaN(num)) return '0%';
  return `${num > 0 ? '+' : ''}${num.toFixed(2)}%`;
} 