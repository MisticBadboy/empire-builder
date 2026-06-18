import { BUSINESS_DEFS, BusinessDef, getBusinessDef, getUpgradeCost, getBusinessIncome } from './businessDefs';
import { TIERS } from '../constants/tiers';

export interface AchievementDef {
  id: string;
  name: string;
  description: string;
  icon: string;
  check: (state: GameState) => boolean;
}

export interface GameState {
  cash: number;
  totalEarned: number;
  businesses: Record<string, { level: number; totalInvested: number }>;
  achievements: string[];
  highestTier: number;
  lastTickTimestamp: number;
  totalPurchases: number;
}

export function getInitialState(): GameState {
  return {
    cash: 500,
    totalEarned: 500,
    businesses: {},
    achievements: [],
    highestTier: 1,
    lastTickTimestamp: Date.now(),
    totalPurchases: 0,
  };
}

export function getNetWorth(state: GameState): number {
  let invested = 0;
  for (const [id, owned] of Object.entries(state.businesses)) {
    invested += owned.totalInvested;
  }
  return state.cash + invested;
}

export function getOwnedLevel(state: GameState, businessId: string): number {
  return state.businesses[businessId]?.level ?? 0;
}

export function getTotalIncomePerSec(state: GameState): number {
  let total = 0;
  for (const [id, owned] of Object.entries(state.businesses)) {
    if (owned.level > 0) {
      const def = getBusinessDef(id);
      total += getBusinessIncome(def, owned.level);
    }
  }
  return total;
}

export function canAfford(state: GameState, cost: number): boolean {
  return state.cash >= cost;
}

export function canPurchase(state: GameState, businessId: string): boolean {
  const def = getBusinessDef(businessId);
  const owned = state.businesses[businessId];
  const cost = owned ? getUpgradeCost(def, owned.level) : def.baseCost;
  return state.cash >= cost && (owned ? owned.level < def.maxLevel : true);
}

export function purchaseBusiness(state: GameState, businessId: string): GameState | null {
  const def = getBusinessDef(businessId);
  const owned = state.businesses[businessId];

  if (!owned) {
    // First purchase
    if (state.cash < def.baseCost) return null;
    return {
      ...state,
      cash: state.cash - def.baseCost,
      totalEarned: state.totalEarned,
      businesses: {
        ...state.businesses,
        [businessId]: { level: 1, totalInvested: def.baseCost },
      },
      totalPurchases: state.totalPurchases + 1,
    };
  }

  // Upgrade
  if (owned.level >= def.maxLevel) return null;
  const cost = getUpgradeCost(def, owned.level);
  if (state.cash < cost) return null;

  return {
    ...state,
    cash: state.cash - cost,
    businesses: {
      ...state.businesses,
      [businessId]: {
        level: owned.level + 1,
        totalInvested: owned.totalInvested + cost,
      },
    },
    totalPurchases: state.totalPurchases + 1,
  };
}

export function tickIncome(state: GameState, deltaTimeSec: number): GameState {
  const income = getTotalIncomePerSec(state);
  if (income <= 0) return state;

  const earned = income * deltaTimeSec;
  return {
    ...state,
    cash: state.cash + earned,
    totalEarned: state.totalEarned + earned,
    lastTickTimestamp: Date.now(),
  };
}

export function calculateOfflineEarnings(state: GameState): { state: GameState; earnings: number } {
  const now = Date.now();
  const elapsed = Math.min((now - state.lastTickTimestamp) / 1000, 8 * 3600); // Max 8 hours
  const income = getTotalIncomePerSec(state);
  const earnings = income * elapsed;

  if (earnings <= 0) return { state, earnings: 0 };

  return {
    state: {
      ...state,
      cash: state.cash + earnings,
      totalEarned: state.totalEarned + earnings,
      lastTickTimestamp: now,
    },
    earnings,
  };
}

export function getUnlockedTier(state: GameState): number {
  const netWorth = getNetWorth(state);
  let highest = 1;
  for (const tier of TIERS) {
    if (netWorth >= tier.unlockNetWorth) {
      highest = tier.id;
    }
  }
  return highest;
}

export function getNextTierUnlock(state: GameState): { current: number; next: number; progress: number } | null {
  const current = getUnlockedTier(state);
  if (current >= 6) return null;
  const nextTier = TIERS[current]; // TIERS is 0-indexed, tier 2 is index 1
  const currentTier = TIERS[current - 1];
  const netWorth = getNetWorth(state);
  const progress = (netWorth - currentTier.unlockNetWorth) / (nextTier.unlockNetWorth - currentTier.unlockNetWorth);
  return { current, next: current + 1, progress: Math.min(progress, 1) };
}
