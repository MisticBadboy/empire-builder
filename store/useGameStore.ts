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
} from './gameStore';
import { checkAchievements } from './achievements';

// Persisted state keys
interface GamePersistedState {
  cash: number;
  totalEarned: number;
  businesses: Record<string, { level: number; totalInvested: number }>;
  achievements: string[];
  highestTier: number;
  lastTickTimestamp: number;
  totalPurchases: number;
}

interface GameActions {
  // Game loop
  tick: (deltaSec: number) => void;

  // Business actions
  buyBusiness: (businessId: string) => boolean;

  // Getters
  getNetWorth: () => number;
  getIncomePerSec: () => number;
  getOwnedLevel: (businessId: string) => number;
  getUnlockedTier: () => number;

  // Offline
  claimOfflineEarnings: () => number;

  // Persistence
  save: () => void;
  load: () => Promise<void>;

  // Raw state access
  getState: () => GameState;
}

export type GameStore = GamePersistedState & GameActions;

// In-memory game state (not in Zustand to avoid render thrashing at 10fps)
let _gameState: GameState = getInitialState();

export const useGameStore = create<GameStore>((set, get) => ({
  // Initial state
  ...getInitialState(),

  tick: (deltaSec: number) => {
    _gameState = tickIncome(_gameState, deltaSec);
    const s = _gameState;
    set({
      cash: s.cash,
      totalEarned: s.totalEarned,
    });
  },

  buyBusiness: (businessId: string) => {
    const newState = purchaseBusiness(_gameState, businessId);
    if (!newState) return false;

    // Check tier unlock
    newState.highestTier = getUnlockedTier(newState);

    // Check achievements
    const newAch = checkAchievements(newState);
    if (newAch.length > 0) {
      newState.achievements = [...newState.achievements, ...newAch];
    }

    _gameState = newState;
    set({
      cash: newState.cash,
      totalEarned: newState.totalEarned,
      businesses: { ...newState.businesses },
      achievements: [...newState.achievements],
      highestTier: newState.highestTier,
      totalPurchases: newState.totalPurchases,
    });
    return true;
  },

  getNetWorth: () => getNetWorth(_gameState),
  getIncomePerSec: () => getTotalIncomePerSec(_gameState),
  getOwnedLevel: (businessId: string) => _gameState.businesses[businessId]?.level ?? 0,
  getUnlockedTier: () => getUnlockedTier(_gameState),

  claimOfflineEarnings: () => {
    const { state: newState, earnings } = calculateOfflineEarnings(_gameState);
    if (earnings > 0) {
      _gameState = newState;
      set({
        cash: newState.cash,
        totalEarned: newState.totalEarned,
      });
    }
    return earnings;
  },

  save: () => {
    try {
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      AsyncStorage.setItem('@empire_builder_save', JSON.stringify(_gameState)).catch(() => {});
    } catch {}
  },

  load: async () => {
    try {
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      const saved = await AsyncStorage.getItem('@empire_builder_save');
      if (saved) {
        const parsed: GameState = JSON.parse(saved);
        // Calculate offline earnings
        const { state: newState, earnings } = calculateOfflineEarnings(parsed);
        newState.highestTier = getUnlockedTier(newState);
        _gameState = newState;
        set({
          cash: newState.cash,
          totalEarned: newState.totalEarned,
          businesses: { ...newState.businesses },
          achievements: [...newState.achievements],
          highestTier: newState.highestTier,
          lastTickTimestamp: newState.lastTickTimestamp,
          totalPurchases: newState.totalPurchases,
        });
      }
    } catch {}
  },

  getState: () => _gameState,
}));
