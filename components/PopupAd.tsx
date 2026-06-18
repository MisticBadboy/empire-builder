/**
 * Popup Ad — Small popup that appears periodically
 * Offers a "bonus" or promotes something. Dismissible.
 * When user taps "Get Boost" → shows a real rewarded ad.
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
import { areAdsRemoved, REMOVE_ADS_OFFER, showRewardedAd, isRewardedReady } from '../services/adService';

interface PopupAdProps {
  visible: boolean;
  onClose: () => void;
  onRemoveAds?: () => void;
  onRewarded?: (type: 'boost' | 'cash') => void;
}

const POPUP_MESSAGES = [
  { icon: '🎁', title: 'Daily Bonus!', subtitle: 'Watch a quick ad for a 2x income boost!', cta: 'Get Boost', rewardType: 'boost' as const },
  { icon: '💰', title: 'Cash Rush!', subtitle: 'Need cash? Watch a short ad for a big bonus!', cta: 'Earn Cash', rewardType: 'cash' as const },
  { icon: '⭐', title: 'Pro Tip!', subtitle: 'Upgrade milestone levels for massive income multipliers!', cta: 'Got it!', rewardType: null },
  { icon: '🏆', title: 'Keep Going!', subtitle: "You're growing your empire. Want to grow faster?", cta: 'Show Me', rewardType: null },
  { icon: '📈', title: 'Market Surge!', subtitle: 'Income rates are high! Watch an ad to boost!', cta: 'Boost!', rewardType: 'boost' as const },
];

export default function PopupAd({ visible, onClose, onRemoveAds, onRewarded }: PopupAdProps) {
  const [popup, setPopup] = useState(() => POPUP_MESSAGES[Math.floor(Math.random() * POPUP_MESSAGES.length)]);
  const [loadingReward, setLoadingReward] = useState(false);
  const fadeAnim = useState(() => new Animated.Value(0))[0];
  const slideAnim = useState(() => new Animated.Value(50))[0];
  const isRemoved = areAdsRemoved();

  useEffect(() => {
    if (!visible) return;
    setPopup(POPUP_MESSAGES[Math.floor(Math.random() * POPUP_MESSAGES.length)]);
    setLoadingReward(false);

    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 250, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, friction: 8, useNativeDriver: true }),
    ]).start();
  }, [visible]);

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 50, duration: 200, useNativeDriver: true }),
    ]).start(() => onClose());
  };

  const handleCta = async () => {
    if (!popup.rewardType) {
      handleClose();
      return;
    }

    // Try to show real rewarded ad
    if (isRewardedReady()) {
      setLoadingReward(true);
      const shown = await showRewardedAd();
      setLoadingReward(false);
      if (shown) {
        onRewarded?.(popup.rewardType);
      }
    } else {
      // Fallback: just give the reward for UX
      onRewarded?.(popup.rewardType);
    }
    handleClose();
  };

  if (isRemoved || !visible) return null;

  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={handleClose}>
      <Pressable style={styles.overlay} onPress={handleClose}>
        <Animated.View
          style={[
            styles.popup,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Pressable style={styles.popupContent} onPress={(e) => e.stopPropagation()}>
            {/* Close Button */}
            <Pressable style={styles.closeBtn} onPress={handleClose}>
              <Text style={styles.closeText}>✕</Text>
            </Pressable>

            {/* Content */}
            <Text style={styles.icon}>{popup.icon}</Text>
            <Text style={styles.title}>{popup.title}</Text>
            <Text style={styles.subtitle}>{popup.subtitle}</Text>

            {/* CTA Button */}
            <Pressable
              style={[styles.ctaButton, loadingReward && styles.ctaDisabled]}
              onPress={handleCta}
              disabled={loadingReward}
            >
              <Text style={styles.ctaText}>
                {loadingReward ? 'Loading...' : popup.cta}
              </Text>
            </Pressable>

            {/* Remove Ads Link */}
            <Pressable style={styles.removeLink} onPress={onRemoveAds}>
              <Text style={styles.removeText}>🚫 {REMOVE_ADS_OFFER.title}</Text>
            </Pressable>
          </Pressable>
        </Animated.View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popup: {
    width: 300,
  },
  popupContent: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  closeBtn: {
    position: 'absolute',
    top: SPACING.sm,
    right: SPACING.sm,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  closeText: {
    color: COLORS.textDim,
    fontSize: 14,
    fontWeight: '600',
  },
  icon: {
    fontSize: 40,
    marginBottom: SPACING.sm,
  },
  title: {
    color: COLORS.text,
    fontSize: 17,
    fontWeight: '800',
    marginBottom: SPACING.xs,
  },
  subtitle: {
    color: COLORS.textDim,
    fontSize: 12,
    textAlign: 'center',
    marginBottom: SPACING.md,
    lineHeight: 16,
  },
  ctaButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.sm,
    minWidth: 140,
    alignItems: 'center',
  },
  ctaDisabled: {
    opacity: 0.6,
  },
  ctaText: {
    color: '#000',
    fontSize: 13,
    fontWeight: '800',
  },
  removeLink: {
    padding: SPACING.xs,
  },
  removeText: {
    color: COLORS.primary,
    fontSize: 11,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});
