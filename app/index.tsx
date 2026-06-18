import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Pressable,
} from 'react-native';
import { useGameStore } from '../store/useGameStore';
import { useGameLoop } from '../utils/useGameLoop';
import { BUSINESS_DEFS, getUpgradeCost, getBusinessIncome } from '../store/businessDefs';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import { TIERS } from '../constants/tiers';
import { formatMoney, formatIncome } from '../utils/formatters';
import { hapticMedium } from '../utils/haptics';
import ProgressBar from '../components/ProgressBar';
import { Link } from 'expo-router';

export default function DashboardScreen() {
  useGameLoop();

  const cash = useGameStore((s) => s.cash);
  const businesses = useGameStore((s) => s.businesses);
  const highestTier = useGameStore((s) => s.highestTier);
  const buyBusiness = useGameStore((s) => s.buyBusiness);
  const getNetWorth = useGameStore((s) => s.getNetWorth);
  const getIncomePerSec = useGameStore((s) => s.getIncomePerSec);

  const netWorth = getNetWorth();
  const incomePerSec = getIncomePerSec();
  const ownedCount = Object.keys(businesses).length;
  const currentTier = TIERS[highestTier - 1];
  const nextTier = highestTier < 6 ? TIERS[highestTier] : null;
  const tierProgress = nextTier
    ? Math.min((netWorth - currentTier.unlockNetWorth) / (nextTier.unlockNetWorth - currentTier.unlockNetWorth), 1)
    : 1;

  // Find best upgrade ROI
  const upgradeOptions = Object.entries(businesses)
    .filter(([, b]) => b.level > 0)
    .map(([id, b]) => {
      const def = BUSINESS_DEFS.find((d) => d.id === id)!;
      const cost = getUpgradeCost(def, b.level);
      const incomeGain = getBusinessIncome(def, b.level + 1) - getBusinessIncome(def, b.level);
      const roi = cost > 0 ? incomeGain / cost : 0;
      return { id, def, level: b.level, cost, incomeGain, roi };
    })
    .filter((o) => o.def.maxLevel > o.level)
    .sort((a, b) => b.roi - a.roi);

  const quickUpgrade = upgradeOptions.length > 0 ? upgradeOptions[0] : null;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Cash Display */}
        <View style={styles.cashSection}>
          <Text style={styles.cashLabel}>CASH</Text>
          <Text style={styles.cashAmount}>{formatMoney(cash)}</Text>
        </View>

        {/* Income + Net Worth Row */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>INCOME/SEC</Text>
            <Text style={styles.statValue}>{formatIncome(incomePerSec)}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>NET WORTH</Text>
            <Text style={styles.statValue}>{formatMoney(netWorth)}</Text>
          </View>
        </View>

        {/* Tier Progress */}
        <View style={styles.tierSection}>
          <View style={styles.tierRow}>
            <Text style={[styles.tierName, { color: currentTier.color }]}>
              {currentTier.name}
            </Text>
            {nextTier && (
              <Text style={styles.tierNext}>
                Next: <Text style={{ color: nextTier.color }}>{nextTier.name}</Text>
              </Text>
            )}
          </View>
          {nextTier && (
            <ProgressBar progress={tierProgress} color={currentTier.color} height={6} showText />
          )}
          {nextTier ? (
            <Text style={styles.tierHint}>
              {formatMoney(netWorth)} / {formatMoney(nextTier.unlockNetWorth)}
            </Text>
          ) : (
            <Text style={[styles.tierHint, { color: COLORS.primary }]}>
              🏆 Maximum tier reached!
            </Text>
          )}
        </View>

        {/* Quick Upgrade */}
        {quickUpgrade && quickUpgrade.cost <= cash && (
          <Pressable
            style={styles.quickBuy}
            onPress={() => {
              hapticMedium();
              buyBusiness(quickUpgrade.id);
            }}
          >
            <Text style={styles.quickBuyIcon}>{quickUpgrade.def.icon}</Text>
            <View style={styles.quickBuyInfo}>
              <Text style={styles.quickBuyTitle}>
                Upgrade {quickUpgrade.def.name} → Lv{quickUpgrade.level + 1}
              </Text>
              <Text style={styles.quickBuyIncome}>
                +{formatIncome(quickUpgrade.incomeGain)}
              </Text>
            </View>
            <Text style={styles.quickBuyCost}>{formatMoney(quickUpgrade.cost)}</Text>
          </Pressable>
        )}

        {/* Your Businesses */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your Businesses ({ownedCount})</Text>
          <Link href="/shop" asChild>
            <Pressable>
              <Text style={styles.seeAll}>See All →</Text>
            </Pressable>
          </Link>
        </View>

        {ownedCount === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyIcon}>🏪</Text>
            <Text style={styles.emptyText}>No businesses yet!</Text>
            <Text style={styles.emptySubtext}>Head to the Shop to start your empire.</Text>
            <Link href="/shop" asChild>
              <Pressable style={styles.shopButton}>
                <Text style={styles.shopButtonText}>Open Shop</Text>
              </Pressable>
            </Link>
          </View>
        ) : (
          Object.entries(businesses)
            .filter(([, b]) => b.level > 0)
            .sort(([, a], [, b]) => b.level - a.level)
            .slice(0, 5)
            .map(([id, owned]) => {
              const def = BUSINESS_DEFS.find((d) => d.id === id)!;
              const tierColor = TIERS[def.tier - 1]?.color ?? COLORS.primary;
              const income = getBusinessIncome(def, owned.level);
              const cost = getUpgradeCost(def, owned.level);
              const canUpgrade = owned.level < def.maxLevel && cash >= cost;
              return (
                <Pressable
                  key={id}
                  style={[styles.bizCard, canUpgrade && styles.bizCardUpgradable]}
                  onPress={() => {
                    if (canUpgrade) {
                      hapticMedium();
                      buyBusiness(id);
                    }
                  }}
                >
                  <View style={[styles.bizIcon, { borderLeftColor: tierColor }]}>
                    <Text style={{ fontSize: 20 }}>{def.icon}</Text>
                  </View>
                  <View style={styles.bizInfo}>
                    <Text style={styles.bizName}>{def.name}</Text>
                    <Text style={styles.bizIncome}>{formatIncome(income)}</Text>
                    <ProgressBar progress={owned.level / def.maxLevel} color={tierColor} height={4} />
                    <Text style={styles.bizLevel}>Lv {owned.level}/{def.maxLevel}</Text>
                  </View>
                  {canUpgrade && (
                    <View style={styles.upgradeButton}>
                      <Text style={styles.upgradeCost}>{formatMoney(cost)}</Text>
                      <Text style={styles.upgradeLabel}>Upgrade</Text>
                    </View>
                  )}
                </Pressable>
              );
            })
        )}

        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  container: { flex: 1 },
  content: { paddingHorizontal: SPACING.lg, paddingTop: SPACING.md },
  cashSection: { alignItems: 'center', paddingVertical: SPACING.lg },
  cashLabel: {
    color: COLORS.textMuted, fontSize: 11, fontWeight: '600',
    letterSpacing: 3, marginBottom: 4,
  },
  cashAmount: {
    color: COLORS.primary, fontSize: 32, fontWeight: '900',
    fontVariant: ['tabular-nums'],
  },
  statsRow: {
    flexDirection: 'row', backgroundColor: COLORS.surface, borderRadius: RADIUS.lg,
    padding: SPACING.md, marginBottom: SPACING.md, borderWidth: 1, borderColor: COLORS.border,
  },
  statBox: { flex: 1, alignItems: 'center' },
  statDivider: { width: 1, backgroundColor: COLORS.border, marginVertical: 4 },
  statLabel: {
    color: COLORS.textMuted, fontSize: 10, fontWeight: '600',
    letterSpacing: 1, marginBottom: 4,
  },
  statValue: {
    color: COLORS.text, fontSize: 16, fontWeight: '800', fontVariant: ['tabular-nums'],
  },
  tierSection: {
    backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, padding: SPACING.md,
    marginBottom: SPACING.md, borderWidth: 1, borderColor: COLORS.border,
  },
  tierRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: SPACING.sm,
  },
  tierName: { fontSize: 16, fontWeight: '800' },
  tierNext: { color: COLORS.textMuted, fontSize: 12 },
  tierHint: {
    color: COLORS.textMuted, fontSize: 11, marginTop: 4,
    fontVariant: ['tabular-nums'],
  },
  quickBuy: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.success + '15',
    borderRadius: RADIUS.lg, padding: SPACING.md, marginBottom: SPACING.md,
    borderWidth: 1.5, borderColor: COLORS.success + '40',
  },
  quickBuyIcon: { fontSize: 28, marginRight: SPACING.md },
  quickBuyInfo: { flex: 1 },
  quickBuyTitle: { color: COLORS.text, fontSize: 14, fontWeight: '700' },
  quickBuyIncome: { color: COLORS.success, fontSize: 12, fontWeight: '600', marginTop: 2 },
  quickBuyCost: {
    color: COLORS.primary, fontSize: 16, fontWeight: '800', fontVariant: ['tabular-nums'],
  },
  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: SPACING.sm,
  },
  sectionTitle: { color: COLORS.text, fontSize: 16, fontWeight: '700' },
  seeAll: { color: COLORS.primary, fontSize: 13, fontWeight: '600' },
  emptyCard: {
    backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, padding: SPACING.xxl,
    alignItems: 'center', borderWidth: 1, borderColor: COLORS.border,
  },
  emptyIcon: { fontSize: 40, marginBottom: SPACING.sm },
  emptyText: { color: COLORS.text, fontSize: 16, fontWeight: '700' },
  emptySubtext: { color: COLORS.textMuted, fontSize: 13, marginTop: 4, marginBottom: SPACING.md },
  shopButton: {
    backgroundColor: COLORS.primary, borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.xl, paddingVertical: SPACING.sm,
  },
  shopButtonText: { color: '#000', fontSize: 14, fontWeight: '800' },
  bizCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg, padding: SPACING.md, marginBottom: SPACING.sm,
    borderWidth: 1, borderColor: COLORS.border,
  },
  bizCardUpgradable: { borderColor: COLORS.primary + '40' },
  bizIcon: {
    width: 40, height: 40, borderRadius: RADIUS.md, backgroundColor: COLORS.surfaceLight,
    justifyContent: 'center', alignItems: 'center', borderLeftWidth: 3, marginRight: SPACING.md,
  },
  bizInfo: { flex: 1 },
  bizName: { color: COLORS.text, fontSize: 14, fontWeight: '700' },
  bizIncome: { color: COLORS.success, fontSize: 12, fontWeight: '600', marginBottom: 4 },
  bizLevel: {
    color: COLORS.textMuted, fontSize: 10, marginTop: 2, fontVariant: ['tabular-nums'],
  },
  upgradeButton: {
    alignItems: 'center', backgroundColor: COLORS.primary + '20', borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm,
    borderWidth: 1, borderColor: COLORS.primary + '40',
  },
  upgradeCost: {
    color: COLORS.primary, fontSize: 12, fontWeight: '800', fontVariant: ['tabular-nums'],
  },
  upgradeLabel: { color: COLORS.primary, fontSize: 10, fontWeight: '600', marginTop: 2 },
});
