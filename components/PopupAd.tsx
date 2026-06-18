/**
 * Popup Ad — Small popup that appears periodically
 * Offers a "bonus" or promotes something. Dismissible.
 */
import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  Animated,
} from 'react-native';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import { areAdsRemoved, REMOVE_ADS_OFFER } from '../services/adService';

interface PopupAdProps {
  visible: boolean;
  onClose: () => void;
  onRemoveAds?: () => void;
}

const POPUP_MESSAGES = [
  { icon: '🎁', title: 'Daily Bonus!', subtitle: 'Watch an ad for 2x income boost for 5 minutes!', cta: 'Get Boost' },
  { icon: '💰', title: 'Cash Rush!', subtitle: 'Need cash? Watch a quick ad for a massive bonus!', cta: 'Earn Cash' },
  { icon: '⭐', title: 'Pro Tip!', subtitle: 'Upgrade milestone levels for massive income multipliers!', cta: 'Got it!' },
  { icon: '🏆', title: 'Keep Going!', subtitle: 'You\'re growing your empire. Want to grow faster?', cta: 'Show Me' },
  { icon: '📈', title: 'Market Surge!', subtitle: 'Income rates are high! Activate a boost now!', cta: 'Boost!' },
];

export default function PopupAd({ visible, onClose, onRemoveAds }: PopupAdProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const [msg] = useState(() => POPUP_MESSAGES[Math.floor(Math.random() * POPUP_MESSAGES.length)]);
  const isRemoved = areAdsRemoved();

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.spring(slideAnim, { toValue: 0, friction: 8, useNativeDriver: true }),
      ]).start();
    } else {
      fadeAnim.setValue(0);
      slideAnim.setValue(50);
    }
  }, [visible]);

  if (isRemoved) return null;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Animated.View
          style={[styles.popup, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
        >
          <Pressable onPress={(e) => e.stopPropagation()}>
            <Text style={styles.popupIcon}>{msg.icon}</Text>
            <Text style={styles.popupTitle}>{msg.title}</Text>
            <Text style={styles.popupSubtitle}>{msg.subtitle}</Text>
            <View style={styles.buttonRow}>
              <Pressable onPress={onClose} style={styles.dismissBtn}>
                <Text style={styles.dismissText}>Later</Text>
              </Pressable>
              <Pressable onPress={onClose} style={styles.ctaBtn}>
                <Text style={styles.ctaText}>{msg.cta}</Text>
              </Pressable>
            </View>
            <Pressable onPress={onRemoveAds} style={styles.removeLink}>
              <Text style={styles.removeText}>
                {REMOVE_ADS_OFFER.price} — No more popups →
              </Text>
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
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  popup: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.xxl,
    width: '100%',
    maxWidth: 320,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.primary + '40',
  },
  popupIcon: {
    fontSize: 48,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  popupTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 4,
    textAlign: 'center',
  },
  popupSubtitle: {
    color: COLORS.textMuted,
    fontSize: 13,
    textAlign: 'center',
    marginBottom: SPACING.lg,
    lineHeight: 18,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  dismissBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surfaceLight,
    alignItems: 'center',
  },
  dismissText: {
    color: COLORS.textMuted,
    fontSize: 13,
    fontWeight: '600',
  },
  ctaBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
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
