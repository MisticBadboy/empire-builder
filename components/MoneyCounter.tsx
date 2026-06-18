import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants/theme';
import { formatMoney } from '../utils/formatters';

interface MoneyCounterProps {
  amount: number;
  size?: number;
  color?: string;
  showLabel?: string;
}

export default function MoneyCounter({ amount, size = 28, color = COLORS.primary, showLabel }: MoneyCounterProps) {
  const [displayAmount, setDisplayAmount] = useState(amount);
  const prevAmount = useRef(amount);
  const animFrame = useRef<number | null>(null);

  useEffect(() => {
    const start = prevAmount.current;
    const end = amount;
    prevAmount.current = amount;

    if (Math.abs(end - start) < 0.01) {
      setDisplayAmount(end);
      return;
    }

    const startTime = Date.now();
    const duration = 150;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayAmount(start + (end - start) * eased);
      if (progress < 1) {
        animFrame.current = requestAnimationFrame(animate);
      }
    };

    animate();
    return () => {
      if (animFrame.current) cancelAnimationFrame(animFrame.current);
    };
  }, [amount]);

  return (
    <View style={styles.container}>
      {showLabel && <Text style={styles.label}>{showLabel}</Text>}
      <Text style={[styles.amount, { fontSize: size, color }]} numberOfLines={1} adjustsFontSizeToFit>
        {formatMoney(displayAmount)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  label: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 2,
    marginBottom: 2,
    textTransform: 'uppercase',
  },
  amount: {
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
});
