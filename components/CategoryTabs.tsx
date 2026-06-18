import React from 'react';
import { ScrollView, Text, Pressable, StyleSheet, View } from 'react-native';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import { BusinessCategory, CATEGORY_LABELS } from '../store/businessDefs';
import { TIERS } from '../constants/tiers';
import { hapticLight } from '../utils/haptics';

interface CategoryTabsProps {
  selected: BusinessCategory | 'all';
  onSelect: (cat: BusinessCategory | 'all') => void;
  highestTier: number;
}

const ALL_CATEGORIES: { key: BusinessCategory | 'all'; label: string }[] = [
  { key: 'all', label: '🌟 All' },
  ...Object.entries(CATEGORY_LABELS).map(([key, label]) => ({
    key: key as BusinessCategory,
    label,
  })),
];

export default function CategoryTabs({ selected, onSelect, highestTier }: CategoryTabsProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {ALL_CATEGORIES.map((cat) => {
        const isActive = selected === cat.key;
        return (
          <Pressable
            key={cat.key}
            onPress={() => {
              hapticLight();
              onSelect(cat.key);
            }}
            style={[styles.tab, isActive && styles.tabActive]}
          >
            <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
              {cat.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    gap: SPACING.sm,
  },
  tab: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surfaceLight,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tabActive: {
    backgroundColor: COLORS.primary + '25',
    borderColor: COLORS.primary + '60',
  },
  tabText: {
    color: COLORS.textMuted,
    fontSize: 13,
    fontWeight: '600',
  },
  tabTextActive: {
    color: COLORS.primary,
  },
});
