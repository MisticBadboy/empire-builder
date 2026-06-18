import { GameState, getNetWorth, getTotalIncomePerSec, getOwnedLevel } from './gameStore';
import { BUSINESS_DEFS } from './businessDefs';

export interface AchievementDef {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export const ACHIEVEMENT_DEFS: AchievementDef[] = [
  { id: 'first_purchase', name: 'First Step', description: 'Purchase your first business', icon: '🎯' },
  { id: 'five_businesses', name: 'Entrepreneur', description: 'Own 5 businesses', icon: '💼' },
  { id: 'ten_businesses', name: 'Business Owner', description: 'Own 10 businesses', icon: '🏢' },
  { id: 'twenty_businesses', name: 'Magnate', description: 'Own 20 businesses', icon: '🏦' },
  { id: 'all_businesses', name: 'Empire Complete', description: 'Own all 36 businesses', icon: '👑' },
  { id: 'first_million', name: 'Millionaire', description: 'Reach $1M net worth', icon: '💰' },
  { id: 'first_billion', name: 'Billionaire', description: 'Reach $1B net worth', icon: '💎' },
  { id: 'first_trillion', name: 'Trillionaire', description: 'Reach $1T net worth', icon: '🪙' },
  { id: 'first_quadrillion', name: 'Quadrillionaire', description: 'Reach $1Qa net worth', icon: '🌟' },
  { id: 'income_1k', name: 'Steady Income', description: 'Earn $1K/s', icon: '📈' },
  { id: 'income_1m', name: 'Money Machine', description: 'Earn $1M/s', icon: '🏭' },
  { id: 'income_1b', name: 'Cash Fountain', description: 'Earn $1B/s', icon: '⛲' },
  { id: 'income_1t', name: 'Infinite Wealth', description: 'Earn $1T/s', icon: '♾️' },
  { id: 'tier2', name: 'Level Up', description: 'Unlock Tier 2', icon: '⬆️' },
  { id: 'tier3', name: 'Big Leagues', description: 'Unlock Tier 3', icon: '🏅' },
  { id: 'tier4', name: 'Corporate Giant', description: 'Unlock Tier 4', icon: '🏛️' },
  { id: 'tier5', name: 'World Domination', description: 'Unlock Tier 5', icon: '🗺️' },
  { id: 'tier6', name: 'Apex Predator', description: 'Unlock Tier 6', icon: '🦖' },
  { id: 'max_upgrade', name: 'Maxed Out', description: 'Max upgrade any business', icon: '⬆️⬆️' },
  { id: 'purchases_100', name: 'Shopaholic', description: 'Make 100 purchases', icon: '🛒' },
];

export function checkAchievements(state: GameState): string[] {
  const newAchievements: string[] = [];
  const ownedCount = Object.keys(state.businesses).length;
  const netWorth = getNetWorth(state);
  const income = getTotalIncomePerSec(state);

  const checks: Record<string, boolean> = {
    first_purchase: state.totalPurchases >= 1,
    five_businesses: ownedCount >= 5,
    ten_businesses: ownedCount >= 10,
    twenty_businesses: ownedCount >= 20,
    all_businesses: ownedCount >= BUSINESS_DEFS.length,
    first_million: netWorth >= 1_000_000,
    first_billion: netWorth >= 1_000_000_000,
    first_trillion: netWorth >= 1_000_000_000_000,
    first_quadrillion: netWorth >= 1_000_000_000_000_000,
    income_1k: income >= 1_000,
    income_1m: income >= 1_000_000,
    income_1b: income >= 1_000_000_000,
    income_1t: income >= 1_000_000_000_000,
    tier2: state.highestTier >= 2,
    tier3: state.highestTier >= 3,
    tier4: state.highestTier >= 4,
    tier5: state.highestTier >= 5,
    tier6: state.highestTier >= 6,
    max_upgrade: Object.values(state.businesses).some((b) => {
      const def = BUSINESS_DEFS.find((d) => d.id !== undefined);
      return b.level >= 100;
    }),
    purchases_100: state.totalPurchases >= 100,
  };

  for (const [id, unlocked] of Object.entries(checks)) {
    if (unlocked && !state.achievements.includes(id)) {
      newAchievements.push(id);
    }
  }

  return newAchievements;
}
