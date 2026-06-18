import React, { useEffect, useState, useRef } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useGameStore } from '../store/useGameStore';
import { initAdService } from '../services/adService';
import InterstitialAd from '../components/InterstitialAd';
import PopupAd from '../components/PopupAd';

export default function RootLayout() {
  const load = useGameStore((s) => s.load);
  const [showInterstitial, setShowInterstitial] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const navCount = useRef(0);

  useEffect(() => {
    load();
    initAdService();
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
      </Stack>

      {/* Global Ad Overlays */}
      <InterstitialAd
        visible={showInterstitial}
        onClose={() => setShowInterstitial(false)}
        onRemoveAds={() => {
          setShowInterstitial(false);
          // Navigate to remove ads screen handled by adService
        }}
      />
      <PopupAd
        visible={showPopup}
        onClose={() => setShowPopup(false)}
        onRemoveAds={() => {
          setShowPopup(false);
        }}
      />
    </SafeAreaProvider>
  );
}
