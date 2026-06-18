/**
 * FloatingMoney — Animated floating "+$X" text that appears when you earn money.
 * Stacks multiple animations on top of each other.
 */
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { COLORS } from '../constants/theme';
import { formatMoney } from '../utils/formatters';

interface FloatingItem {
  id: number;
  amount: number;
  anim: Animated.Value;
}

interface FloatingMoneyProps {
  trigger: number; // increment to spawn a new float
  amount: number;
}

export default function FloatingMoney({ trigger, amount }: FloatingMoneyProps) {
  const [items, setItems] = useState<FloatingItem[]>([]);
  const idCounter = useRef(0);

  useEffect(() => {
    if (trigger === 0) return;

    const id = idCounter.current++;
    const anim = new Animated.Value(0);

    setItems((prev) => [...prev, { id, amount, anim }]);

    Animated.parallel([
      Animated.timing(anim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setItems((prev) => prev.filter((item) => item.id !== id));
    });
  }, [trigger]);

  return (
    <View style={styles.container} pointerEvents="none">
      {items.map((item) => (
        <Animated.Text
          key={item.id}
          style={[
            styles.text,
            {
              opacity: item.anim.interpolate({
                inputRange: [0, 0.3, 1],
                outputRange: [0, 1, 0],
              }),
              transform: [
                {
                  translateY: item.anim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -60],
                  }),
                },
                {
                  scale: item.anim.interpolate({
                    inputRange: [0, 0.2, 1],
                    outputRange: [0.5, 1.2, 0.8],
                  }),
                },
              ],
            },
          ]}
        >
          +{formatMoney(item.amount)}
        </Animated.Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    pointerEvents: 'none',
  },
  text: {
    color: COLORS.primary,
    fontSize: 20,
    fontWeight: '900',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    position: 'absolute',
    top: 10,
  },
});
