# Empire Builder — Ad & Revenue Setup Guide

## What I Need From You

### 1. Google AdMob (for interstitials + rewarded ads)
Create a Google AdMob account at https://admob.google.com

Then provide me with:
- **AdMob App ID** (format: `ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX`)
- **Interstitial Ad Unit ID** (format: `ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX`)
- **Rewarded Ad Unit ID** (format: `ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX`)

### 2. Google Play Console (for the $4.99 Remove Ads IAP)
Create a Google Play Developer account ($25 one-time) at https://play.google.com/console

Then provide me with:
- **Google Play License Key** (from Setup > Licensing)

### 3. Apple App Store Connect (for iOS IAP)
If you want iOS too, you need an Apple Developer account ($99/year) at https://developer.apple.com

Then provide me with:
- **Bundle ID** (already set: `com.empirebuilder.tycoon`)
- **Apple Shared Secret** (for server-to-server receipt validation)

### 4. RevenueCat (recommended — handles IAP on both platforms)
Sign up for free at https://revenuecat.com

This handles:
- In-app purchases on iOS AND Android from one dashboard
- Subscription management
- Receipt validation
- Analytics

Then provide me with:
- **RevenueCat Public API Key**
- **RevenueCat App UUID**

---

## How Ads Will Work in the App

| Ad Type | When it shows | Can be removed? |
|---------|---------------|-----------------|
| Interstitial | Between screen transitions (every 15-45s) | ✅ Yes ($4.99) |
| Popup | Periodic bonus offers (every 60-120s) | ✅ Yes ($4.99) |
| Rewarded 2x Boost | User taps "Watch Ad" button | ❌ Always available |
| Rewarded Cash Bonus | User taps "Watch Ad" button | ❌ Always available |

The $4.99 Remove Ads purchase removes interstitials + popups.
The 2x Boost and Cash Bonus buttons stay forever — they're opt-in value.

---

## Current Status
- ✅ Simulated ad system built (works in Expo Go)
- ✅ "Remove Ads" purchase screen built
- ✅ Interstitial + popup ad components built
- ✅ All ad state management built
- ⏳ Waiting for: AdMob IDs, IAP config, RevenueCat keys

Once you give me the keys, I'll swap the simulated ads for real AdMob ads
and wire up the $4.99 purchase with RevenueCat.
