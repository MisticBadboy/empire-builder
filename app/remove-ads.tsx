/**
 * Remove Ads Screen — IAP purchase screen
 * Shows what you get for removing ads with a big CTA button.
 * Uses RevenueCat for real purchases on Google Play / App Store.
 */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import { hapticLight, hapticMedium } from '../utils/haptics';
import { REMOVE_ADS_OFFER, removeAds, areAdsRemoved } from '../services/adService';
import {
  initPurchases,
  purchaseRemoveAds,
  restoreRemoveAds,
  hasPurchasedRemoveAds,
  getRemoveAdsPrice,
} from '../services/purchaseService';

const FEATURES = [
  { icon: '🚫', text: 'No popup ads between screens' },
  { icon: '📴', text: 'No banner ads' },
  { icon: '⚡', text: 'No interstitial interruptions' },
  { icon: '🎁', text: 'Keep your 2x Boost & Cash Bonus!' },
  { icon: '💰', text: 'All earned rewards stay forever' },
];

export default function RemoveAdsScreen() {
  const insets = useSafeAreaInsets();
  const [purchased, setPurchased] = useState(areAdsRemoved());
  const [purchasing, setPurchasing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [price, setPrice] = useState('$4.99');

  useEffect(() => {
    (async () => {
      await initPurchases();
      const has = await hasPurchasedRemoveAds();
      if (has) {
        await removeAds(); // Sync local state
        setPurchased(true);
      }
      setPrice(getRemoveAdsPrice());
      setLoading(false);
    })();
  }, []);

  const handlePurchase = async () => {
    if (purchasing) return;
    setPurchasing(true);
    hapticMedium();

    const result = await purchaseRemoveAds();

    if (result.success) {
      await removeAds();
      setPurchased(true);
      hapticMedium();
      Alert.alert('✅ Purchase Complete!', 'All ads have been removed. Enjoy Empire Builder!', [
        { text: 'Awesome!', onPress: () => router.back() },
      ]);
    } else if (result.error !== 'cancelled') {
      Alert.alert('Purchase Failed', result.error || 'Something went wrong. Please try again.');
    }

    setPurchasing(false);
  };

  const handleRestore = async () => {
    hapticLight();
    setLoading(true);
    const restored = await restoreRemoveAds();
    setLoading(false);

    if (restored) {
      await removeAds();
      setPurchased(true);
      Alert.alert('✅ Restored!', 'Your previous purchase has been restored.');
    } else {
      Alert.alert('No Purchase Found', 'We couldn\'t find a previous Remove Ads purchase on this account.');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingTop: insets.top + SPACING.md, paddingBottom: insets.bottom + SPACING.xxl }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Back */}
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backArrow}>←</Text>
          <Text style={styles.backText}>Back</Text>
        </Pressable>

        {/* Hero */}
        <View style={styles.hero}>
          <View style={styles.heroIcon}>
            <Text style={styles.heroEmoji}>🚫</Text>
          </View>
          <Text style={styles.heroTitle}>{REMOVE_ADS_OFFER.title}</Text>
          <Text style={styles.heroSubtitle}>{REMOVE_ADS_OFFER.subtitle}</Text>
        </View>

        {/* What You Get */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What you get:</Text>
          {FEATURES.map((f, i) => (
            <View key={i} style={styles.featureRow}>
              <Text style={styles.featureIcon}>{f.icon}</Text>
              <Text style={styles.featureText}>{f.text}</Text>
            </View>
          ))}
        </View>

        {/* Important note */}
        <View style={styles.noteCard}>
          <Text style={styles.noteText}>
            💡 The 2x Boost and Cash Bonus buttons are <Text style={{ fontWeight: '800' }}>opt-in rewarded ads</Text> — they give you free bonuses and will <Text style={{ fontWeight: '800' }}>always be available</Text> even after purchase.
          </Text>
        </View>

        {/* CTA */}
        {purchased ? (
          <View style={styles.purchasedCard}>
            <Text style={styles.purchasedIcon}>✅</Text>
            <Text style={styles.purchasedText}>Ads Already Removed!</Text>
            <Text style={styles.purchasedSub}>Thank you for your support.</Text>
          </View>
        ) : (
          <Pressable
            style={[styles.purchaseBtn, purchasing && styles.purchaseBtnLoading]}
            onPress={handlePurchase}
            disabled={purchasing || loading}
          >
            {purchasing ? (
              <>
                <ActivityIndicator color="#000" size="small" />
                <Text style={styles.purchaseLabel}>Processing...</Text>
              </>
            ) : loading ? (
              <>
                <ActivityIndicator color="#000" size="small" />
                <Text style={styles.purchaseLabel}>Loading...</Text>
              </>
            ) : (
              <>
                <Text style={styles.purchasePrice}>{price}</Text>
                <Text style={styles.purchaseLabel}>Remove All Ads — Forever</Text>
                <Text style={styles.purchaseNote}>{REMOVE_ADS_OFFER.priceNote}</Text>
              </>
            )}
          </Pressable>
        )}

        {/* Restore */}
        <Pressable onPress={handleRestore} style={styles.restoreBtn} disabled={loading}>
          <Text style={styles.restoreText}>Restore Purchase</Text>
        </Pressable>

        {/* Legal */}
        <Text style={styles.legal}>
          Payment will be charged to your Google Play account at confirmation of purchase. This is a one-time purchase with no recurring charges.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scroll: { paddingHorizontal: SPACING.lg },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: SPACING.lg },
  backArrow: { color: COLORS.primary, fontSize: 18, fontWeight: '700' },
  backText: { color: COLORS.primary, fontSize: 15, fontWeight: '600' },
  hero: { alignItems: 'center', marginBottom: SPACING.xxl, marginTop: SPACING.md },
  heroIcon: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: COLORS.primary + '15', justifyContent: 'center', alignItems: 'center',
    marginBottom: SPACING.md,
  },
  heroEmoji: { fontSize: 40 },
  heroTitle: { color: COLORS.text, fontSize: 24, fontWeight: '900', marginBottom: 4 },
  heroSubtitle: { color: COLORS.textMuted, fontSize: 15, textAlign: 'center' },
  section: { marginBottom: SPACING.xl },
  sectionTitle: { color: COLORS.text, fontSize: 16, fontWeight: '800', marginBottom: SPACING.md },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, marginBottom: SPACING.md },
  featureIcon: { fontSize: 22, width: 30 },
  featureText: { color: COLORS.text, fontSize: 14, flex: 1 },
  noteCard: {
    backgroundColor: COLORS.surfaceLight, borderRadius: RADIUS.md,
    padding: SPACING.md, marginBottom: SPACING.xl,
    borderLeftWidth: 3, borderLeftColor: COLORS.primary,
  },
  noteText: { color: COLORS.textMuted, fontSize: 13, lineHeight: 18 },
  purchaseBtn: {
    backgroundColor: COLORS.primary, borderRadius: RADIUS.lg,
    padding: SPACING.xl, alignItems: 'center', marginBottom: SPACING.md,
  },
  purchaseBtnLoading: { opacity: 0.7 },
  purchasePrice: { color: '#000', fontSize: 28, fontWeight: '900' },
  purchaseLabel: { color: '#000', fontSize: 16, fontWeight: '800', marginTop: 2 },
  purchaseNote: { color: '#000', fontSize: 12, opacity: 0.6, marginTop: 4 },
  purchasedCard: {
    backgroundColor: COLORS.success + '15', borderRadius: RADIUS.lg,
    padding: SPACING.xl, alignItems: 'center', marginBottom: SPACING.md,
    borderWidth: 1, borderColor: COLORS.success + '40',
  },
  purchasedIcon: { fontSize: 36, marginBottom: SPACING.sm },
  purchasedText: { color: COLORS.success, fontSize: 18, fontWeight: '800' },
  purchasedSub: { color: COLORS.textMuted, fontSize: 13, marginTop: 4 },
  restoreBtn: { alignItems: 'center', padding: SPACING.md },
  restoreText: { color: COLORS.textMuted, fontSize: 13, textDecorationLine: 'underline' },
  legal: {
    color: COLORS.textDim, fontSize: 10, textAlign: 'center',
    marginTop: SPACING.sm, lineHeight: 14, paddingHorizontal: SPACING.md,
  },
});
