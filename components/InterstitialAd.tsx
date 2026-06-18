/**
 * Interstitial Ad — Full-screen fake ad shown between screen transitions
 * Shows a fake app ad with a countdown timer before the close button appears.
 * Respects "Remove Ads" IAP — won't show if purchased.
 */
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  Animated,
} from 'react-native';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import { getRandomAd, areAdsRemoved, REMOVE_ADS_OFFER } from '../services/adService';

interface InterstitialAdProps {
  visible: boolean;
  onClose: () => void;
  onRemoveAds?: () => void;
}

export default function InterstitialAd({ visible, onClose, onRemoveAds }: InterstitialAdProps) {
  const [countdown, setCountdown] = useState(3);
  const [canClose, setCanClose] = useState(false);
  const [ad, setAd] = useState(() => getRandomAd());
  const fadeAnim = useState(() => new Animated.Value(0))[0];
  const isRemoved = areAdsRemoved();

  useEffect(() => {
    if (visible) {
      setAd(getRandomAd());
      setCountdown(3);
      setCanClose(false);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  useEffect(() => {
    if (!visible || canClose) return;
    const timer = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          setCanClose(true);
          clearInterval(timer);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [visible, canClose]);

  if (isRemoved) return null;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={canClose ? onClose : undefined}>
      <View style={styles.overlay}>
        <Animated.View style={[styles.adCard, { opacity: fadeAnim }]}>
          {/* Close button or countdown */}
          {canClose ? (
            <Pressable onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeBtnText}>✕</Text>
            </Pressable>
          ) : (
            <View style={styles.countdownBadge}>
              <Text style={styles.countdownText}>{countdown}</Text>
            </View>
          )}

          {/* Ad Content */}
          <View style={[styles.adHeader, { backgroundColor: ad.color + '30' }]}>
            <Text style={styles.adIcon}>{ad.icon}</Text>
          </View>
          <Text style={styles.adTitle}>{ad.title}</Text>
          <Text style={styles.adSubtitle}>{ad.subtitle}</Text>

          <Pressable style={[styles.adCta, { backgroundColor: ad.color }]} onPress={onClose}>
            <Text style={styles.adCtaText}>{ad.cta}</Text>
          </Pressable>

          {/* Remove Ads Upsell */}
          <Pressable onPress={onRemoveAds} style={styles.removeAdsLink}>
            <Text style={styles.removeAdsText}>
              {REMOVE_ADS_OFFER.price} — Remove all ads forever →
            </Text>
          </Pressable>

          <Text style={styles.adLabel}>ADVERTISEMENT</Text>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  adCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.xxl,
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  closeBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  closeBtnText: {
    color: COLORS.textMuted,
    fontSize: 16,
    fontWeight: '700',
  },
  countdownBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  countdownText: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '800',
  },
  adHeader: {
    width: 80,
    height: 80,
    borderRadius: RADIUS.xl,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  adIcon: {
    fontSize: 40,
  },
  adTitle: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 4,
  },
  adSubtitle: {
    color: COLORS.textMuted,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  adCta: {
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: RADIUS.full,
    marginBottom: SPACING.md,
  },
  adCtaText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
  },
  removeAdsLink: {
    padding: SPACING.sm,
  },
  removeAdsText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  adLabel: {
    color: COLORS.textDim,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 2,
    marginTop: SPACING.sm,
  },
});
