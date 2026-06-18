/**
 * Interstitial Ad — Full-screen ad shown between screen transitions
 * 
 * If real AdMob interstitial is loaded → shows it via the ad service
 * If not → shows a fake ad fallback so the UX still feels right
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
import { getRandomAd, areAdsRemoved, REMOVE_ADS_OFFER, showInterstitial } from '../services/adService';

interface InterstitialAdProps {
  visible: boolean;
  onClose: () => void;
  onRemoveAds?: () => void;
}

export default function InterstitialAd({ visible, onClose, onRemoveAds }: InterstitialAdProps) {
  const [countdown, setCountdown] = useState(3);
  const [canClose, setCanClose] = useState(false);
  const [ad, setAd] = useState(() => getRandomAd());
  const [showRealAd, setShowRealAd] = useState(false);
  const fadeAnim = useState(() => new Animated.Value(0))[0];
  const isRemoved = areAdsRemoved();

  useEffect(() => {
    if (!visible || isRemoved) return;

    // Try to show real ad
    const tryRealAd = async () => {
      const shown = await showInterstitial();
      if (shown) {
        setShowRealAd(true);
        // Real ad is now showing — AdMob handles the UI
        // After it closes, the ad component calls onClose
      } else {
        setShowRealAd(false);
      }
    };
    tryRealAd();
  }, [visible, isRemoved]);

  useEffect(() => {
    if (!visible || isRemoved || showRealAd) return;

    setAd(getRandomAd());
    setCountdown(3);
    setCanClose(false);
    setShowRealAd(false);

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setCanClose(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [visible, isRemoved, showRealAd]);

  const handleClose = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      onClose();
      setShowRealAd(false);
    });
  };

  if (isRemoved || !visible) return null;

  // If real ad is showing, AdMob handles its own UI
  // Just return null — the AdMob activity is fullscreen
  if (showRealAd) return null;

  // Fallback: fake ad with countdown
  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={handleClose}>
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        <View style={styles.adCard}>
          {/* Ad Badge */}
          <View style={styles.adBadge}>
            <Text style={styles.adBadgeText}>AD</Text>
          </View>

          {/* Ad Content */}
          <View style={[styles.adHeader, { backgroundColor: ad.color }]}>
            <Text style={styles.adIcon}>{ad.icon}</Text>
          </View>
          <View style={styles.adBody}>
            <Text style={styles.adTitle}>{ad.title}</Text>
            <Text style={styles.adSubtitle}>{ad.subtitle}</Text>
            <Pressable style={[styles.adCta, { backgroundColor: ad.color }]}>
              <Text style={styles.adCtaText}>{ad.cta}</Text>
            </Pressable>
          </View>

          {/* Close Button */}
          {canClose && (
            <Pressable style={styles.closeButton} onPress={handleClose}>
              <Text style={styles.closeIcon}>✕</Text>
            </Pressable>
          )}

          {/* Countdown */}
          {!canClose && (
            <View style={styles.countdownContainer}>
              <Text style={styles.countdown}>{countdown}</Text>
            </View>
          )}

          {/* Remove Ads Upsell */}
          <Pressable style={styles.removeAdsBar} onPress={onRemoveAds}>
            <Text style={styles.removeAdsText}>{REMOVE_ADS_OFFER.title} — {REMOVE_ADS_OFFER.price}</Text>
          </Pressable>

          <Text style={styles.adLabel}>ADVERTISEMENT</Text>
        </View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  adCard: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
  },
  adBadge: {
    position: 'absolute',
    top: SPACING.sm,
    left: SPACING.sm,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    zIndex: 10,
  },
  adBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
  },
  adHeader: {
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
  },
  adIcon: {
    fontSize: 60,
  },
  adBody: {
    padding: SPACING.lg,
    alignItems: 'center',
  },
  adTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: SPACING.xs,
  },
  adSubtitle: {
    color: COLORS.textDim,
    fontSize: 13,
    textAlign: 'center',
    marginBottom: SPACING.md,
    lineHeight: 18,
  },
  adCta: {
    paddingHorizontal: 32,
    paddingVertical: 10,
    borderRadius: RADIUS.md,
  },
  adCtaText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '800',
  },
  closeButton: {
    position: 'absolute',
    top: SPACING.sm,
    right: SPACING.sm,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  closeIcon: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  countdownContainer: {
    position: 'absolute',
    top: SPACING.sm,
    right: SPACING.sm,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  countdown: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '800',
  },
  removeAdsBar: {
    padding: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    alignItems: 'center',
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
    textAlign: 'center',
    paddingBottom: SPACING.sm,
  },
});
