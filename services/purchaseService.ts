/**
 * Purchase Service — RevenueCat IAP integration
 * 
 * Handles the "Remove Ads" ($4.99) one-time purchase.
 * Uses RevenueCat SDK for receipt validation and purchase management.
 * 
 * Product ID: empire_builder_remove_ads
 * Entitlement: ads_removed
 */

import Purchases, { PurchasesPackage } from 'react-native-purchases';

const REVENUECAT_API_KEY = 'test_wpPfJLghHKlMaqFyIAwVYvmmQRD';
const ENTITLEMENT_ID = 'ads_removed';
const PRODUCT_ID = 'empire_builder_remove_ads';

let _initialized = false;
let _packages: PurchasesPackage[] = [];
let _removeAdsPackage: PurchasesPackage | null = null;

// Initialize RevenueCat
export async function initPurchases(): Promise<void> {
  if (_initialized) return;
  try {
    Purchases.setLogLevel(__DEV__ ? Purchases.LOG_LEVEL.DEBUG : Purchases.LOG_LEVEL.WARN);
    await Purchases.configure({ apiKey: REVENUECAT_API_KEY });
    _initialized = true;
    
    // Fetch available packages
    await refreshPackages();
  } catch (err) {
    console.warn('[Purchases] Init failed:', err);
  }
}

// Refresh available packages from store
export async function refreshPackages(): Promise<void> {
  try {
    const customerInfo = await Purchases.getCustomerInfo();
    // Check if already has entitlement
    if (customerInfo.entitlements.active[ENTITLEMENT_ID]) {
      _removeAdsPackage = null; // Already purchased
      return;
    }
  } catch {}

  try {
    // Get offerings (you configure these in RevenueCat dashboard)
    const offerings = await Purchases.getOfferings();
    if (offerings.current) {
      _packages = offerings.current.availablePackages;
      _removeAdsPackage = _packages.find(
        (pkg) => pkg.product.identifier === PRODUCT_ID
      ) || _packages[0] || null;
    }
  } catch (err) {
    console.warn('[Purchases] Failed to fetch packages:', err);
  }
}

// Check if user has purchased Remove Ads
export async function hasPurchasedRemoveAds(): Promise<boolean> {
  try {
    const customerInfo = await Purchases.getCustomerInfo();
    return !!customerInfo.entitlements.active[ENTITLEMENT_ID];
  } catch {
    return false;
  }
}

// Purchase Remove Ads
export async function purchaseRemoveAds(): Promise<{ success: boolean; error?: string }> {
  if (!_removeAdsPackage) {
    // Try to refresh packages first
    await refreshPackages();
    if (!_removeAdsPackage) {
      return { success: false, error: 'Product not available. Please try again.' };
    }
  }

  try {
    const result = await Purchases.purchasePackage(_removeAdsPackage);
    
    // Check if entitlement is active after purchase
    if (result.customerInfo.entitlements.active[ENTITLEMENT_ID]) {
      return { success: true };
    }
    return { success: false, error: 'Purchase completed but entitlement not active.' };
  } catch (err: any) {
    // User cancelled
    if (err?.userCancelled) {
      return { success: false, error: 'cancelled' };
    }
    return { success: false, error: err?.message || 'Purchase failed.' };
  }
}

// Restore purchases
export async function restoreRemoveAds(): Promise<boolean> {
  try {
    const customerInfo = await Purchases.restorePurchases();
    return !!customerInfo.entitlements.active[ENTITLEMENT_ID];
  } catch {
    return false;
  }
}

// Get formatted price for display
export function getRemoveAdsPrice(): string {
  if (_removeAdsPackage) {
    return _removeAdsPackage.product.priceString;
  }
  return '$4.99'; // fallback
}

// Get entitlement status (cached check, non-async)
let _cachedEntitlement: boolean | null = null;

export function isEntitlementActive(): boolean | null {
  return _cachedEntitlement;
}

export async function refreshEntitlementStatus(): Promise<boolean> {
  try {
    const customerInfo = await Purchases.getCustomerInfo();
    _cachedEntitlement = !!customerInfo.entitlements.active[ENTITLEMENT_ID];
    return _cachedEntitlement;
  } catch {
    return false;
  }
}
