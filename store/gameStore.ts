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
  // Ad boost state
  boostMultiplier: number;       // 1 = no boost, 2 = 2x from ad
  boostExpiresAt: number;        // timestamp when boost ends
  lastAdWatchedAt: number;       // timestamp of last ad (for cooldown)
  totalAdsWatched: number;       // lifetime ad count
}

const AD_COOLDOWN_MS = 30_000;     // 30 sec between ads
const AD_BOOST_DURATION_MS = 300_000; // 5 min boost
const AD_BOOST_MULTIPLIER = 2;
const AD_CASH_BONUS_MULTIPLIER = 30; // 30x income per second as cash bonus

export function getInitialState(): GameState {
  return {
    cash: 500,
    totalEarned: 500,
    businesses: {},
    achievements: [],
    highestTier: 1,
    lastTickTimestamp: Date.now(),
    totalPurchases: 0,
    boostMultiplier: 1,
    boostExpiresAt: 0,
    lastAdWatchedAt: 0,
    totalAdsWatched: 0,
  };
}

export function tickIncome(state: GameState, deltaSec: number): GameState {
  const incomePerSec = getTotalIncomePerSec(state) * state.boostMultiplier;
  const earned = incomePerSec * deltaSec;

  // Check if boost expired
  let boostMult = state.boostMultiplier;
  if (boostMult > 1 && Date.now() > state.boostExpiresAt) {
    boostMult = 1;
  }

  const newTier = getUnlockedTier({ ...state, cash: state.cash + earned, totalEarned: state.totalEarned + earned });

  return {
    ...state,
    cash: state.cash + earned,
    totalEarned: state.totalEarned + earned,
    boostMultiplier: boostMult,
    highestTier: Math.max(state.highestTier, newTier),
  };
}

export function purchaseBusiness(state: GameState, businessId: string): GameState {
  const def = getBusinessDef(businessId);
  const current = state.businesses[businessId] || { level: 0, totalInvested: 0 };
  const cost = getUpgradeCost(def, current.level);

  if (state.cash < cost) return state;
  if (current.level >= def.maxLevel) return state;

  const newLevel = current.level + 1;

  const newState = {
    ...state,
    cash: state.cash - cost,
    businesses: {
      ...state.businesses,
      [businessId]: {
        level: newLevel,
        totalInvested: current.totalInvested + cost,
      },
    },
    totalPurchases: state.totalPurchases + 1,
  };
  newState.highestTier = Math.max(newState.highestTier, getUnlockedTier(newState));
  return newState;
}

export function getNetWorth(state: GameState): number {
  let worth = state.cash;
  for (const [id, save] of Object.entries(state.businesses)) {
    worth += save.totalInvested;
    const def = BUSINESS_DEFS.find((b) => b.id === id);
    if (def) {
      worth += getBusinessIncome(def, save.level) * 3600; // 1 hour of income
    }
  }
  return worth;
}

export function getTotalIncomePerSec(state: GameState): number {
  let total = 0;
  for (const [id, save] of Object.entries(state.businesses)) {
    const def = BUSINESS_DEFS.find((b) => b.id === id);
    if (def) {
      total += getBusinessIncome(def, save.level);
    }
  }
  return total;
}

export function getOwnedLevel(state: GameState, businessId: string): number {
  return state.businesses[businessId]?.level ?? 0;
}

// Get time remaining on ad boost (in seconds)
export function getBoostTimeRemaining(state: GameState): number {
  if (state.boostMultiplier <= 1) return 0;
  const remaining = state.boostExpiresAt - Date.now();
  return remaining > 0 ? remaining / 1000 : 0;
}

// Check if ad can be watched (cooldown expired)
export function canWatchAd(state: GameState): boolean {
  return Date.now() - state.lastAdWatchedAt >= AD_COOLDOWN_MS;
}

// Get ad cooldown remaining (in seconds)
export function getAdCooldown(state: GameState): number {
  const remaining = AD_COOLDOWN_MS - (Date.now() - state.lastAdWatchedAt);
  return remaining > 0 ? remaining / 1000 : 0;
}

// Watch a rewarded ad — activate 2x boost
export function watchAdBoost(state: GameState): GameState {
  if (!canWatchAd(state)) return state;

  return {
    ...state,
    boostMultiplier: AD_BOOST_MULTIPLIER,
    boostExpiresAt: Date.now() + AD_BOOST_DURATION_MS,
    lastAdWatchedAt: Date.now(),
    totalAdsWatched: state.totalAdsWatched + 1,
  };
}

// Watch a rewarded ad — get instant cash bonus (30x income/sec)
export function watchAdCashBonus(state: GameState): GameState {
  if (!canWatchAd(state)) return state;

  const income = getTotalIncomePerSec(state);
  const bonus = income * AD_CASH_BONUS_MULTIPLIER;

  return {
    ...state,
    cash: state.cash + Math.max(bonus, 100), // minimum $100 bonus
    totalEarned: state.totalEarned + Math.max(bonus, 100),
    lastAdWatchedAt: Date.now(),
    totalAdsWatched: state.totalAdsWatched + 1,
  };
}

export function calculateOfflineEarnings(state: GameState): { newState: GameState; earnings: number } {
  const now = Date.now();
  const offlineMs = now - state.lastTickTimestamp;
  if (offlineMs < 60_000) return { newState: state, earnings: 0 }; // < 1 min

  const maxOfflineMs = 4 * 60 * 60 * 1000; // 4 hours max
  const cappedMs = Math.min(offlineMs, maxOfflineMs);
  const deltaSec = cappedMs / 1000;

  const incomePerSec = getTotalIncomePerSec(state);
  const earnings = incomePerSec * deltaSec * 0.5; // 50% efficiency offline

  return {
    newState: {
      ...state,
      cash: state.cash + earnings,
      totalEarned: state.totalEarned + earnings,
      lastTickTimestamp: now,
    },
    earnings,
  };
}

// Calculate tier from businesses owned
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
