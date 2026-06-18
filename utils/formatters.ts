const SUFFIXES = [
  '', '', 'K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No', 'Dc',
];

export function formatMoney(amount: number): string {
  if (amount < 0) return `-$${formatMoney(-amount)}`;
  if (amount < 1000) return `$${Math.floor(amount).toLocaleString()}`;

  // Find the right suffix
  let tier = Math.floor(Math.log10(Math.abs(amount)) / 3);
  if (tier >= SUFFIXES.length) tier = SUFFIXES.length - 1;

  const suffix = SUFFIXES[tier];
  const scale = Math.pow(10, tier * 3);
  const scaled = amount / scale;

  if (scaled >= 100) return `$${Math.floor(scaled)}${suffix}`;
  if (scaled >= 10) return `$${scaled.toFixed(1)}${suffix}`;
  return `$${scaled.toFixed(2)}${suffix}`;
}

export function formatMoneyFull(amount: number): string {
  return `$${Math.floor(amount).toLocaleString('en-US')}`;
}

export function formatIncome(amount: number): string {
  return `${formatMoney(amount)}/s`;
}

export function formatTime(seconds: number): string {
  if (seconds < 60) return `${Math.floor(seconds)}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${Math.floor(seconds % 60)}s`;
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  return `${hours}h ${mins}m`;
}

export function formatPercent(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}

export function formatCompact(amount: number): string {
  if (amount >= 1e15) return `${(amount / 1e15).toFixed(1)}Q`;
  if (amount >= 1e12) return `${(amount / 1e12).toFixed(1)}T`;
  if (amount >= 1e9) return `${(amount / 1e9).toFixed(1)}B`;
  if (amount >= 1e6) return `${(amount / 1e6).toFixed(1)}M`;
  if (amount >= 1e3) return `${(amount / 1e3).toFixed(1)}K`;
  return `${Math.floor(amount)}`;
}
