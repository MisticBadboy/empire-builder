import React, { useEffect, useState } from 'react';
import { View, Text, Modal, StyleSheet, Pressable } from 'react-native';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import { formatMoney } from '../utils/formatters';
import { hapticSuccess } from '../utils/haptics';

interface OfflinePopupProps {
  visible: boolean;
  earnings: number;
  onClose: () => void;
}

export default function OfflinePopup({ visible, earnings, onClose }: OfflinePopupProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (visible && earnings > 0) {
      hapticSuccess();
      setShow(true);
    }
  }, [visible, earnings]);

  if (!show || earnings <= 0) return null;

  return (
    <Modal transparent visible={show} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.popup}>
          <Text style={styles.emoji}>💰</Text>
          <Text style={styles.title}>Welcome Back!</Text>
          <Text style={styles.subtitle}>While you were away, your businesses earned:</Text>
          <Text style={styles.amount}>{formatMoney(earnings)}</Text>
          <Text style={styles.subtext}>That's free money. Keep building!</Text>
          <Pressable
            style={styles.button}
            onPress={() => {
              setShow(false);
              onClose();
            }}
          >
            <Text style={styles.buttonText}>Claim & Continue</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xxxl,
  },
  popup: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.xxxl,
    alignItems: 'center',
    width: '100%',
    maxWidth: 340,
    borderWidth: 1,
    borderColor: COLORS.primary + '40',
  },
  emoji: {
    fontSize: 48,
    marginBottom: SPACING.md,
  },
  title: {
    color: COLORS.text,
    fontSize: 22,
    fontWeight: '800',
    marginBottom: SPACING.sm,
  },
  subtitle: {
    color: COLORS.textMuted,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  amount: {
    color: COLORS.primary,
    fontSize: 32,
    fontWeight: '900',
    fontVariant: ['tabular-nums'],
    marginBottom: SPACING.sm,
  },
  subtext: {
    color: COLORS.textMuted,
    fontSize: 12,
    marginBottom: SPACING.xl,
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.xxxl,
    paddingVertical: SPACING.md,
  },
  buttonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '800',
  },
});
