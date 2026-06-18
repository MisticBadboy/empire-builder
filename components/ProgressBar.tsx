import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING } from '../constants/theme';

interface ProgressBarProps {
  progress: number; // 0-1
  color?: string;
  height?: number;
  showText?: boolean;
  label?: string;
}

export default function ProgressBar({
  progress,
  color = COLORS.primary,
  height = 8,
  showText = false,
  label,
}: ProgressBarProps) {
  const clampedProgress = Math.min(Math.max(progress, 0), 1);

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.track, { height }]}>
        <View
          style={[
            styles.fill,
            {
              width: `${clampedProgress * 100}%`,
              backgroundColor: color,
              height,
            },
          ]}
        />
      </View>
      {showText && (
        <Text style={styles.text}>{Math.floor(clampedProgress * 100)}%</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    color: COLORS.textMuted,
    fontSize: 11,
    marginBottom: 4,
    fontWeight: '500',
  },
  track: {
    backgroundColor: COLORS.surfaceLight,
    borderRadius: 999,
    overflow: 'hidden',
  },
  fill: {
    borderRadius: 999,
  },
  text: {
    color: COLORS.textMuted,
    fontSize: 11,
    textAlign: 'right',
    marginTop: 2,
  },
});
