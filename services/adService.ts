/**
 * Ad Service — Simulated ad system
 * 
 * This is a realistic ad simulation that can be swapped for real SDK later.
 * - Interstitial ads: shown between screen transitions (every N navigations)
 * - Rewarded ads: user watches for 2x boost or cash bonus (already in gameStore)
 * - Banner ads: bottom banner (can be removed with IAP)
 * - Pop-up ads: periodic popup offers
 * 
 * When the user purchases "Remove Ads" ($4.99), interstitials and banners are disabled.
 * Rewarded ads (2x boost, cash bonus) ALWAYS remain — they're opt-in value.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const ADS_REMOVED_KEY = 'empire_builder_ads_removed';

// How many screen navigations between interstitials
const INTERSTITIAL_INTERVAL = 5;

// Popup ad interval (in seconds since app open)
const POPUP_INTERVAL_SEC = 120; // every 2 minutes

// Ad types that can appear
export type AdType = 'interstitial' | 'rewarded' | 'banner' | 'popup';

// Fake ad content for simulated ads
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

// Remove Ads upsell content
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

// State
let _navigationCount = 0;
let _adsRemoved = false;
let _lastPopupTime = 0;
let _listeners: ((type: AdType) => void)[] = [];

// Initialize
export async function initAdService(): Promise<void> {
  try {
    const val = await AsyncStorage.getItem(ADS_REMOVED_KEY);
    _adsRemoved = val === 'true';
  } catch {
    _adsRemoved = false;
  }
  _lastPopupTime = Date.now();
}

// Check if ads are removed
export function areAdsRemoved(): boolean {
  return _adsRemoved;
}

// Mark ads as removed (after IAP)
export async function removeAds(): Promise<void> {
  _adsRemoved = true;
  try {
    await AsyncStorage.setItem(ADS_REMOVED_KEY, 'true');
  } catch {}
}

// Restore purchase check
export async function restorePurchases(): Promise<boolean> {
  try {
    const val = await AsyncStorage.getItem(ADS_REMOVED_KEY);
    _adsRemoved = val === 'true';
    return _adsRemoved;
  } catch {
    return false;
  }
}

// Called every time user navigates between screens
export function onNavigation(): AdType | null {
  _navigationCount++;

  if (_adsRemoved) return null;

  // Interstitial every N navigations
  if (_navigationCount % INTERSTITIAL_INTERVAL === 0) {
    return 'interstitial';
  }

  // Popup check
  const now = Date.now();
  if (now - _lastPopupTime >= POPUP_INTERVAL_SEC * 1000) {
    _lastPopupTime = now;
    return 'popup';
  }

  return null;
}

// Get a random fake ad
export function getRandomAd() {
  return FAKE_ADS[Math.floor(Math.random() * FAKE_ADS.length)];
}

// Subscribe to ad events (for UI to react)
export function onAdEvent(listener: (type: AdType) => void): () => void {
  _listeners.push(listener);
  return () => {
    _listeners = _listeners.filter((l) => l !== listener);
  };
}

// Fire ad event
export function fireAdEvent(type: AdType) {
  _listeners.forEach((l) => l(type));
}

// Should show banner (always true unless ads removed)
export function shouldShowBanner(): boolean {
  return !_adsRemoved;
}
