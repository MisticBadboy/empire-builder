import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Pressable,
} from 'react-native';
import { useGameStore } from '../store/useGameStore';
import { BUSINESS_DEFS, BUSINESS_DEFS as ALL_BUSINESSES, BusinessCategory, CATEGORY_LABELS } from '../store/businessDefs';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import { TIERS } from '../constants/tiers';
import { formatMoney } from '../utils/formatters';
import { hapticLight, hapticMedium } from '../utils/haptics';
import BusinessCard from '../components/BusinessCard';

const TIER_FILTERS: { key: number | 'all'; label: string }[] = [
  { key: 'all', label: '🌟 All' },
  ...TIERS.map((t) => ({ key: t.id, label: `Tier ${t.id}` })),
];

export default function ShopScreen() {
  const cash = useGameStore((s) => s.cash);
  const businesses = useGameStore((s) => s.businesses);
  const highestTier = useGameStore((s) => s.highestTier);
  const buyBusiness = useGameStore((s) => s.buyBusiness);

  const [selectedTier, setSelectedTier] = useState<number | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<BusinessCategory | 'all'>('all');

  const filteredBusinesses = ALL_BUSINESSES.filter((b) => {
    // Tier filter
    if (selectedTier !== 'all' && b.tier !== selectedTier) return false;
    // Category filter
    if (selectedCategory !== 'all' && b.category !== selectedCategory) return false;
    return true;
  });

  // Group by tier
  const groupedByTier: Record<number, typeof ALL_BUSINESSES> = {};
  for (const b of filteredBusinesses) {
    if (!groupedByTier[b.tier]) groupedByTier[b.tier] = [];
    groupedByTier[b.tier].push(b);
  }

  const handlePurchase = (businessId: string) => {
    const success = buyBusiness(businessId);
    if (success) {
      hapticMedium();
    } else {
      hapticLight();
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>🏪 SHOP</Text>
        <View style={styles.cashBadge}>
          <Text style={styles.cashText}>💰 {formatMoney(cash)}</Text>
        </View>
      </View>

      {/* Tier Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
      >
        {TIER_FILTERS.map((f) => {
          const isActive = selectedTier === f.key;
          const isLocked = f.key !== 'all' && (f.key as number) > highestTier;
          return (
            <Pressable
              key={String(f.key)}
              onPress={() => {
                if (!isLocked) {
                  hapticLight();
                  setSelectedTier(f.key);
                }
              }}
              style={[
                styles.filterPill,
                isActive && styles.filterPillActive,
                isLocked && styles.filterPillLocked,
              ]}
            >
              <Text style={[styles.filterText, isActive && styles.filterTextActive, isLocked && styles.filterTextLocked]}>
                {isLocked ? '🔒' : f.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Category Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
      >
        {(['all', 'food_beverage', 'retail', 'services', 'real_estate', 'technology', 'luxury'] as const).map((cat) => {
          const isActive = selectedCategory === cat;
          const label = cat === 'all' ? '🌟 All' : CATEGORY_LABELS[cat];
          return (
            <Pressable
              key={cat}
              onPress={() => {
                hapticLight();
                setSelectedCategory(cat);
              }}
              style={[styles.filterPill, isActive && styles.filterPillActive]}
            >
              <Text style={[styles.filterText, isActive && styles.filterTextActive]}>
                {label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Business List */}
      <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
        {filteredBusinesses.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>🔒</Text>
            <Text style={styles.emptyText}>No businesses match your filters.</Text>
          </View>
        ) : (
          Object.entries(groupedByTier)
            .sort(([a], [b]) => Number(a) - Number(b))
            .map(([tier, tierBusinesses]) => {
              const tierDef = TIERS[Number(tier) - 1];
              const isTierLocked = Number(tier) > highestTier;
              return (
                <View key={tier}>
                  <View style={styles.tierHeader}>
                    <Text style={[styles.tierName, { color: tierDef.color }]}>
                      {isTierLocked ? '🔒 ' : ''}{tierDef.name}
                    </Text>
                    <Text style={styles.tierBusinesses}>
                      {tierBusinesses.length} businesses
                    </Text>
                  </View>
                  {tierBusinesses.map((biz) => (
                    <BusinessCard
                      key={biz.id}
                      business={biz}
                      level={businesses[biz.id]?.level ?? 0}
                      cash={isTierLocked ? 0 : cash}
                      onPurchase={() => handlePurchase(biz.id)}
                    />
                  ))}
                </View>
              );
            })
        )}
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  title: {
    color: COLORS.primary,
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 2,
  },
  cashBadge: {
    backgroundColor: COLORS.primary + '20',
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderWidth: 1,
    borderColor: COLORS.primary + '40',
  },
  cashText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  filterRow: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.sm,
    gap: SPACING.sm,
  },
  filterPill: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surfaceLight,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filterPillActive: {
    backgroundColor: COLORS.primary + '25',
    borderColor: COLORS.primary + '60',
  },
  filterPillLocked: {
    opacity: 0.4,
  },
  filterText: {
    color: COLORS.textMuted,
    fontSize: 12,
    fontWeight: '600',
  },
  filterTextActive: {
    color: COLORS.primary,
  },
  filterTextLocked: {
    color: COLORS.textDim,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.sm,
  },
  tierHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
    paddingHorizontal: SPACING.xs,
  },
  tierName: {
    fontSize: 16,
    fontWeight: '800',
  },
  tierBusinesses: {
    color: COLORS.textMuted,
    fontSize: 12,
  },
  empty: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: SPACING.md,
  },
  emptyText: {
    color: COLORS.textMuted,
    fontSize: 14,
  },
});
