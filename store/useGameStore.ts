import { create } from 'zustand';
import {
  GameState,
  getInitialState,
  tickIncome,
  purchaseBusiness,
  getNetWorth,
  getTotalIncomePerSec,
  getUnlockedTier,
  calculateOfflineEarnings,
  getBoostTimeRemaining,
  canWatchAd,
  getAdCooldown,
  watchAdBoost,
  watchAdCashBonus,
} from './gameStore';
import { checkAchievements } from './achievements';

interface GameActions {
  tick: (deltaSec: number) => void;
  buyBusiness: (businessId: string) => boolean;
  save: () => void;
  load: () => void;
  resetGame: () => void;
  getNetWorth: () => number;
  getIncomePerSec: () => number;
  // Ad actions
  watchAdBoost: () => boolean;
  watchAdCashBonus: () => boolean;
  getBoostTimeRemaining: () => number;
  canWatchAd: () => boolean;
  getAdCooldown: () => number;
  getState: () => GameState;
}

type GameStore = GameState & GameActions;

let _gameState = getInitialState();

export const useGameStore = create<GameStore>((set, get) => ({
  ..._gameState,

  tick: (deltaSec: number) => {
    const state = get() as GameState;
    const newState = tickIncome(state, deltaSec);

    // checkAchievements returns new achievement IDs (string[]), not a GameState
    const newAchIds = checkAchievements(newState);
    if (newAchIds.length > 0) {
      newState.achievements = [...newState.achievements, ...newAchIds];
    }

    // Sync
    _gameState = newState;
    set({
      cash: newState.cash,
      totalEarned: newState.totalEarned,
      businesses: { ...newState.businesses },
      achievements: [...newState.achievements],
      highestTier: newState.highestTier,
      lastTickTimestamp: newState.lastTickTimestamp,
      totalPurchases: newState.totalPurchases,
      boostMultiplier: newState.boostMultiplier,
      boostExpiresAt: newState.boostExpiresAt,
    });
  },

  buyBusiness: (businessId: string) => {
    const state = get();
    const newState = purchaseBusiness(state as GameState, businessId);
    if (newState === state) return false;

    _gameState = newState;
    set({
      cash: newState.cash,
      totalEarned: newState.totalEarned,
      businesses: { ...newState.businesses },
      totalPurchases: newState.totalPurchases,
      highestTier: newState.highestTier,
    });
    return true;
  },

  save: () => {
    try {
      const state = get();
      const data = {
        cash: state.cash,
        totalEarned: state.totalEarned,
        businesses: state.businesses,
        achievements: state.achievements,
        highestTier: state.highestTier,
        lastTickTimestamp: Date.now(),
        totalPurchases: state.totalPurchases,
        boostMultiplier: state.boostMultiplier,
        boostExpiresAt: state.boostExpiresAt,
        lastAdWatchedAt: state.lastAdWatchedAt,
        totalAdsWatched: state.totalAdsWatched,
      };
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      AsyncStorage.setItem('empire_builder_save_v2', JSON.stringify(data));
    } catch {}
  },

  load: () => {
    try {
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      AsyncStorage.getItem('empire_builder_save_v2').then((json: string | null) => {
        if (!json) return;
        const data = JSON.parse(json);
        const initial = getInitialState();
        const loaded: GameState = {
          ...initial,
          ...data,
          lastTickTimestamp: Date.now(),
          // Clamp boost: if expired before we loaded, reset it
          boostMultiplier: data.boostExpiresAt > Date.now() ? (data.boostMultiplier || 1) : 1,
          boostExpiresAt: data.boostExpiresAt || 0,
          lastAdWatchedAt: data.lastAdWatchedAt || 0,
          totalAdsWatched: data.totalAdsWatched || 0,
        };

        // Calculate offline earnings
        const { newState, earnings } = calculateOfflineEarnings(loaded);

        _gameState = newState;
        set({
          cash: newState.cash,
          totalEarned: newState.totalEarned,
          businesses: { ...newState.businesses },
          achievements: [...newState.achievements],
          highestTier: newState.highestTier,
          lastTickTimestamp: newState.lastTickTimestamp,
          totalPurchases: newState.totalPurchases,
          boostMultiplier: newState.boostMultiplier,
          boostExpiresAt: newState.boostExpiresAt,
          lastAdWatchedAt: newState.lastAdWatchedAt,
          totalAdsWatched: newState.totalAdsWatched,
        });
      });
    } catch {}
  },

  resetGame: () => {
    const initial = getInitialState();
    _gameState = initial;
    try {
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      AsyncStorage.removeItem('empire_builder_save_v2');
    } catch {}
    set({ ...initial });
  },

  getNetWorth: () => getNetWorth(get() as GameState),
  getIncomePerSec: () => getTotalIncomePerSec(get() as GameState),

  // Ad functions
  watchAdBoost: () => {
    const state = get();
    if (!canWatchAd(state as GameState)) return false;
    const newState = watchAdBoost(state as GameState);
    _gameState = newState;
    set({
      boostMultiplier: newState.boostMultiplier,
      boostExpiresAt: newState.boostExpiresAt,
      lastAdWatchedAt: newState.lastAdWatchedAt,
      totalAdsWatched: newState.totalAdsWatched,
    });
    return true;
  },

  watchAdCashBonus: () => {
    const state = get();
    if (!canWatchAd(state as GameState)) return false;
    const newState = watchAdCashBonus(state as GameState);
    _gameState = newState;
    set({
      cash: newState.cash,
      totalEarned: newState.totalEarned,
      lastAdWatchedAt: newState.lastAdWatchedAt,
      totalAdsWatched: newState.totalAdsWatched,
    });
    return true;
  },

  getBoostTimeRemaining: () => getBoostTimeRemaining(get() as GameState),
  canWatchAd: () => canWatchAd(get() as GameState),
  getAdCooldown: () => getAdCooldown(get() as GameState),

  // Cloud save/load
  cloudSaveToAccount: async () => { /* handled by authService */ },
  cloudLoadFromAccount: async () => { /* handled by authService */ },

  getState: () => _gameState,
}));
