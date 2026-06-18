import React, { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useGameStore } from '../store/useGameStore';
import { initAdService, onAdEvent } from '../services/adService';
import InterstitialAd from '../components/InterstitialAd';
import PopupAd from '../components/PopupAd';

export default function RootLayout() {
  const load = useGameStore((s) => s.load);
  const [showInterstitial, setShowInterstitial] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    load();
    initAdService();

    // Listen for ad events from the ad service
    const unsub = onAdEvent((type) => {
      if (type === 'interstitial') {
        setShowInterstitial(true);
      } else if (type === 'popup') {
        setShowPopup(true);
      }
    });

    return unsub;
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="business/[id]" options={{ headerShown: false, presentation: 'card' }} />
        <Stack.Screen
          name="remove-ads"
          options={{
            headerShown: false,
            presentation: 'modal',
            animation: 'slide_from_bottom',
          }}
        />
        <Stack.Screen
          name="account"
          options={{
            headerShown: false,
            presentation: 'card',
            animation: 'slide_from_right',
          }}
        />
      </Stack>

      {/* Global Ad Overlays */}
      <InterstitialAd
        visible={showInterstitial}
        onClose={() => setShowInterstitial(false)}
        onRemoveAds={() => setShowInterstitial(false)}
      />
      <PopupAd
        visible={showPopup}
        onClose={() => setShowPopup(false)}
        onRemoveAds={() => setShowPopup(false)}
        onRewarded={(type) => {
          const store = useGameStore.getState();
          if (type === 'boost') {
            store.watchAdBoost();
          } else if (type === 'cash') {
            store.watchAdCashBonus();
          }
        }}
      />
    </SafeAreaProvider>
  );
}
