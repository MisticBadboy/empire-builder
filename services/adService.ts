/**
 * Ad Service — Real Google AdMob integration
 * 
 * Uses react-native-google-mobile-ads for:
 * - Interstitial ads: shown between screen transitions
 * - Rewarded ads: user watches for 2x boost or cash bonus
 * - Rewarded Interstitial: optional combo
 * 
 * When the user purchases "Remove Ads" ($4.99), interstitials are disabled.
 * Rewarded ads (2x boost, cash bonus) ALWAYS remain — they're opt-in value.
 */

import { 
  AdEventType, 
  InterstitialAd, 
  RewardedAd,
  RewardedAdEventType,
  TestIds,
  MobileAds,
} from 'react-native-google-mobile-ads';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ADS_REMOVED_KEY = 'empire_builder_ads_removed';

// ─── Ad Unit IDs ───────────────────────────────────────────
// Real IDs from Google AdMob dashboard
const INTERSTITIAL_UNIT_ID = 'ca-app-pub-6751661713322837/7488915266';
const REWARDED_UNIT_ID = 'ca-app-pub-6751661713322837/4289816522';

// Set to true during development to use test ads instead
const USE_TEST_ADS = false;

const interstitialId = USE_TEST_ADS ? TestIds.INTERSTITIAL : INTERSTITIAL_UNIT_ID;
const rewardedId = USE_TEST_ADS ? TestIds.REWARDED : REWARDED_UNIT_ID;

// ─── Config ────────────────────────────────────────────────
// How many screen navigations between interstitials
const INTERSTITIAL_INTERVAL = 5;

// Popup ad interval (in seconds since app open)
const POPUP_INTERVAL_SEC = 120; // every 2 minutes

// ─── Types ─────────────────────────────────────────────────
export type AdType = 'interstitial' | 'rewarded' | 'banner' | 'popup';

// ─── Ad Instances ──────────────────────────────────────────
const interstitial = InterstitialAd.createForAdRequest(interstitialId, {
  requestNonPersonalizedAdsOnly: false,
  keywords: ['gaming', 'idle', 'tycoon', 'empire', 'business'],
});

const rewarded = RewardedAd.createForAdRequest(rewardedId, {
  requestNonPersonalizedAdsOnly: false,
  keywords: ['gaming', 'idle', 'tycoon', 'empire', 'business'],
});

// ─── Remove Ads Offer Content ──────────────────────────────
export const REMOVE_ADS_OFFER = {
  title: '🚫 Remove All Ads',
  subtitle: 'Enjoy Empire Builder ad-free!',
  features: [
    'No popup ads between screens',
    'No banner ads',
    'No interstitial interruptions',
    'Keep your 2x Boost & Cash Bonus!',
  ],
  price: '$4.99',
  priceNote: 'One-time purchase',
};

// ─── State ─────────────────────────────────────────────────
let _navigationCount = 0;
let _adsRemoved = false;
let _lastPopupTime = 0;
let _listeners: ((type: AdType) => void)[] = [];
let _interstitialLoaded = false;
let _rewardedLoaded = false;
let _initialized = false;

// ─── Fake ad data (kept for PopupAd visuals) ───────────────
export const FAKE_ADS = [
  {
    id: 'promo_gem_rush',
    title: '💎 Gem Rush Tycoon',
    subtitle: 'Mine precious gems and build your empire!',
    cta: 'Install Now',
    color: '#9B59B6',
    icon: '💎',
  },
  {
    id: 'promo_cash_king',
    title: '👑 Cash King',
    subtitle: 'Tap to earn millions! #1 idle game.',
    cta: 'Play Free',
    color: '#F39C12',
    icon: '💰',
  },
  {
    id: 'promo_city_build',
    title: '🏙️ City Builder 2',
    subtitle: 'Build the ultimate metropolis.',
    cta: 'Get It',
    color: '#2ECC71',
    icon: '🏗️',
  },
  {
    id: 'promo_space_empire',
    title: '🚀 Space Empire',
    subtitle: 'Conquer the galaxy! New update out now.',
    cta: 'Download',
    color: '#3498DB',
    icon: '🚀',
  },
  {
    id: 'promo_farm_frenzy',
    title: '🌾 Farm Frenzy',
    subtitle: 'Harvest crops, build your farm!',
    cta: 'Try It',
    color: '#27AE60',
    icon: '🌾',
  },
];

// ─── Initialization ────────────────────────────────────────
export async function initAdService(): Promise<void> {
  if (_initialized) return;

  try {
    const val = await AsyncStorage.getItem(ADS_REMOVED_KEY);
    _adsRemoved = val === 'true';
  } catch {
    _adsRemoved = false;
  }
  _lastPopupTime = Date.now();

  // Initialize the Google Mobile Ads SDK
  try {
    await MobileAds().initialize();
    _initialized = true;
    console.log('[AdMob] SDK initialized successfully');
  } catch (err) {
    console.warn('[AdMob] SDK init failed:', err);
    _initialized = false;
    return;
  }

  // Pre-load the first interstitial
  loadInterstitial();

  // Set up rewarded ad listeners
  setupRewardedListeners();
}

// ─── Interstitial Ads ──────────────────────────────────────
function loadInterstitial() {
  if (_adsRemoved) return;

  const unsubscribeLoaded = interstitial.addAdEventListener(AdEventType.LOADED, () => {
    _interstitialLoaded = true;
    console.log('[AdMob] Interstitial loaded');
  });

  const unsubscribeClosed = interstitial.addAdEventListener(AdEventType.CLOSED, () => {
    _interstitialLoaded = false;
    // Pre-load next interstitial
    loadInterstitial();
  });

  const unsubscribeError = interstitial.addAdEventListener(AdEventType.ERROR, (err) => {
    _interstitialLoaded = false;
    console.warn('[AdMob] Interstitial error:', err);
    // Retry after delay
    setTimeout(loadInterstitial, 30000);
  });

  interstitial.load();
}

export async function showInterstitial(): Promise<boolean> {
  if (_adsRemoved) return false;
  if (!_interstitialLoaded) {
    console.log('[AdMob] Interstitial not ready');
    return false;
  }

  try {
    await interstitial.show();
    fireAdEvent('interstitial');
    return true;
  } catch (err) {
    console.warn('[AdMob] Interstitial show failed:', err);
    return false;
  }
}

// ─── Rewarded Ads ──────────────────────────────────────────
function setupRewardedListeners() {
  const unsubscribeLoaded = rewarded.addAdEventListener(RewardedAdEventType.LOADED, () => {
    _rewardedLoaded = true;
    console.log('[AdMob] Rewarded ad loaded');
  });

  const unsubscribeEarned = rewarded.addAdEventListener(RewardedAdEventType.EARNED_REWARD, (reward) => {
    console.log('[AdMob] Rewarded earned:', reward);
    fireAdEvent('rewarded');
  });

  const unsubscribeClosed = rewarded.addAdEventListener(AdEventType.CLOSED, () => {
    _rewardedLoaded = false;
    // Pre-load next rewarded
    loadRewarded();
  });

  const unsubscribeError = rewarded.addAdEventListener(AdEventType.ERROR, (err) => {
    _rewardedLoaded = false;
    console.warn('[AdMob] Rewarded error:', err);
    setTimeout(loadRewarded, 30000);
  });

  loadRewarded();
}

function loadRewarded() {
  rewarded.load();
}

/**
 * Show a rewarded ad. Returns true if the reward was earned.
 * Used for 2x boost and cash bonus.
 */
export async function showRewardedAd(): Promise<boolean> {
  if (!_rewardedLoaded) {
    console.log('[AdMob] Rewarded ad not ready');
    return false;
  }

  try {
    await rewarded.show();
    // Reward is delivered via the EARNED_REWARD listener above
    return true;
  } catch (err) {
    console.warn('[AdMob] Rewarded show failed:', err);
    return false;
  }
}

export function isRewardedReady(): boolean {
  return _rewardedLoaded;
}

// ─── Core State ────────────────────────────────────────────
export function areAdsRemoved(): boolean {
  return _adsRemoved;
}

export async function removeAds(): Promise<void> {
  _adsRemoved = true;
  try {
    await AsyncStorage.setItem(ADS_REMOVED_KEY, 'true');
  } catch {}
}

export async function restorePurchases(): Promise<boolean> {
  try {
    const val = await AsyncStorage.getItem(ADS_REMOVED_KEY);
    _adsRemoved = val === 'true';
    return _adsRemoved;
  } catch {
    return false;
  }
}

// ─── Navigation Events ─────────────────────────────────────
export function onNavigation(): AdType | null {
  _navigationCount++;

  if (_adsRemoved) return null;

  // Interstitial every N navigations
  if (_navigationCount % INTERSTITIAL_INTERVAL === 0) {
    if (_interstitialLoaded) {
      showInterstitial();
      return 'interstitial';
    }
  }

  // Popup check (visual only — not a real ad)
  const now = Date.now();
  if (now - _lastPopupTime >= POPUP_INTERVAL_SEC * 1000) {
    _lastPopupTime = now;
    return 'popup';
  }

  return null;
}

// ─── Fake Ad Data (for popup visuals) ──────────────────────
export function getRandomAd() {
  return FAKE_ADS[Math.floor(Math.random() * FAKE_ADS.length)];
}

// ─── Event System ──────────────────────────────────────────
export function onAdEvent(listener: (type: AdType) => void): () => void {
  _listeners.push(listener);
  return () => {
    _listeners = _listeners.filter((l) => l !== listener);
  };
}

export function fireAdEvent(type: AdType) {
  _listeners.forEach((l) => l(type));
}

export function shouldShowBanner(): boolean {
  return !_adsRemoved;
}
