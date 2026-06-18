import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS } from '../constants/theme';
import { formatMoney } from '../utils/formatters';

interface MoneyCounterProps {
  amount: number;
  size?: 'sm' | 'md' | 'lg' | 'hero';
  color?: string;
  showLabel?: boolean;
}

export default function MoneyCounter({ amount, size = 'lg', color = COLORS.primary, showLabel = false }: MoneyCounterProps) {
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

  const fontSize = size === 'hero' ? FONTS.hero : size === 'lg' ? FONTS.xxl : size === 'md' ? FONTS.xl : FONTS.large;

  return (
    <View style={styles.container}>
      {showLabel && <Text style={[styles.label, { fontSize: fontSize * 0.5 }]}>NET WORTH</Text>}
      <Text style={[styles.amount, { fontSize, color }]} numberOfLines={1} adjustsFontSizeToFit>
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
    fontWeight: '600',
    letterSpacing: 2,
    marginBottom: 4,
  },
  amount: {
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
});
