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
import { COLORS, SPACING, RADIUS, FONTS } from '../constants/theme';
import { TIERS } from '../constants/tiers';
import { formatMoney, formatIncome } from '../utils/formatters';
import { hapticLight } from '../utils/haptics';
import MoneyCounter from '../components/MoneyCounter';
import ProgressBar from '../components/ProgressBar';
import { Link } from 'expo-router';

export default function DashboardScreen() {
  useGameLoop();

  const cash = useGameStore((s) => s.cash);
  const totalEarned = useGameStore((s) => s.totalEarned);
  const businesses = useGameStore((s) => s.businesses);
  const highestTier = useGameStore((s) => s.highestTier);
  const buyBusiness = useGameStore((s) => s.buyBusiness);
  const getNetWorth = useGameStore((s) => s.getNetWorth);
  const getIncomePerSec = useGameStore((s) => s.getIncomePerSec);

  const netWorth = getNetWorth();
  const incomePerSec = getIncomePerSec();

  // Get owned businesses sorted by income (highest first)
  const ownedBusinesses = BUSINESS_DEFS.filter((b) => {
    const owned = businesses[b.id];
    return owned && owned.level > 0;
  }).sort((a, b) => {
    const incomeA = getBusinessIncome(a, businesses[a.id]?.level ?? 0);
    const incomeB = getBusinessIncome(b, businesses[b.id]?.level ?? 0);
    return incomeB - incomeA;
  });

  // Next tier progress
  const currentTierDef = TIERS[highestTier - 1];
  const nextTierDef = TIERS[highestTier] || null;
  const tierProgress = nextTierDef
    ? Math.min((netWorth - currentTierDef.unlockNetWorth) / (nextTierDef.unlockNetWorth - currentTierDef.unlockNetWorth), 1)
    : 1;

  const handleUpgrade = (businessId: string) => {
    buyBusiness(businessId);
    hapticLight();
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.gameTitle}>💰 EMPIRE BUILDER</Text>
        </View>

        {/* Net Worth Card */}
        <View style={styles.netWorthCard}>
          <Text style={styles.netWorthLabel}>NET WORTH</Text>
          <MoneyCounter amount={netWorth} size="hero" />
          <View style={styles.incomeRow}>
            <Text style={styles.incomeIcon}>📈</Text>
            <Text style={styles.incomeText}>{formatIncome(incomePerSec)}</Text>
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{formatMoney(cash)}</Text>
            <Text style={styles.statLabel}>Cash on Hand</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{ownedBusinesses.length}</Text>
            <Text style={styles.statLabel}>Businesses</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={[styles.statValue, { color: TIERS[highestTier - 1]?.color }]}>
              {TIERS[highestTier - 1]?.name}
            </Text>
            <Text style={styles.statLabel}>Rank</Text>
          </View>
        </View>

        {/* Tier Progress */}
        {nextTierDef && (
          <View style={styles.tierCard}>
            <View style={styles.tierHeader}>
              <Text style={styles.tierTitle}>
                🔓 Next: {nextTierDef.name}
              </Text>
              <Text style={styles.tierSubtitle}>
                {formatMoney(nextTierDef.unlockNetWorth)} net worth
              </Text>
            </View>
            <ProgressBar
              progress={tierProgress}
              color={nextTierDef.color}
              height={8}
            />
          </View>
        )}

        {/* Section Header */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your Businesses</Text>
          <Link href="/shop" asChild>
            <Pressable onPress={() => hapticLight()}>
              <Text style={styles.seeAll}>View All →</Text>
            </Pressable>
          </Link>
        </View>

        {/* Owned Businesses */}
        {ownedBusinesses.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🏪</Text>
            <Text style={styles.emptyTitle}>No businesses yet!</Text>
            <Text style={styles.emptyText}>Visit the Shop tab to buy your first business.</Text>
            <Link href="/shop" asChild>
              <Pressable style={styles.shopButton}>
                <Text style={styles.shopButtonText}>Open Shop</Text>
              </Pressable>
            </Link>
          </View>
        ) : (
          ownedBusinesses.map((business) => {
            const owned = businesses[business.id];
            const level = owned?.level ?? 0;
            const upgradeCost = getUpgradeCost(business, level);
            const income = getBusinessIncome(business, level);
            const nextIncome = getBusinessIncome(business, level + 1);
            const canAfford = cash >= upgradeCost;
            const isMaxed = level >= business.maxLevel;
            const tierColor = TIERS[business.tier - 1]?.color ?? COLORS.primary;

            return (
              <Pressable
                key={business.id}
                onPress={() => !isMaxed && handleUpgrade(business.id)}
                style={({ pressed }) => [
                  styles.businessCard,
                  pressed && !isMaxed && styles.businessCardPressed,
                  !canAfford && !isMaxed && { opacity: 0.6 },
                ]}
              >
                <View style={[styles.bizIconWrap, { borderLeftColor: tierColor }]}>
                  <Text style={styles.bizIcon}>{business.icon}</Text>
                  <View style={[styles.levelPill, { backgroundColor: tierColor }]}>
                    <Text style={styles.levelPillText}>{level}</Text>
                  </View>
                </View>

                <View style={styles.bizInfo}>
                  <View style={styles.bizTopRow}>
                    <Text style={styles.bizName} numberOfLines={1}>{business.name}</Text>
                    <Text style={styles.bizIncome}>{formatIncome(income)}</Text>
                  </View>
                  <ProgressBar progress={level / business.maxLevel} color={tierColor} height={5} />
                  <View style={styles.bizBottomRow}>
                    <Text style={styles.bizNext}>
                      {isMaxed ? '✅ MAXED' : `→ ${formatIncome(nextIncome)}`}
                    </Text>
                    <Text style={styles.bizLevel}>
                      {level}/{business.maxLevel}
                    </Text>
                  </View>
                </View>

                {!isMaxed && (
                  <View style={[styles.upgradeBtn, canAfford && styles.upgradeBtnActive]}>
                    <Text style={styles.upgradeBtnText}>⬆️</Text>
                    <Text style={[styles.upgradeCost, !canAfford && { color: COLORS.textDim }]}>
                      {formatMoney(upgradeCost)}
                    </Text>
                  </View>
                )}
              </Pressable>
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
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
  },
  header: {
    alignItems: 'center',
    paddingVertical: SPACING.md,
  },
  gameTitle: {
    color: COLORS.primary,
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 3,
  },
  netWorthCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.primary + '30',
    marginBottom: SPACING.md,
  },
  netWorthLabel: {
    color: COLORS.textMuted,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 3,
    marginBottom: 4,
  },
  incomeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.sm,
    gap: 6,
  },
  incomeIcon: {
    fontSize: 14,
  },
  incomeText: {
    color: COLORS.success,
    fontSize: 16,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: COLORS.border,
    marginVertical: 4,
  },
  statValue: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 2,
  },
  statLabel: {
    color: COLORS.textMuted,
    fontSize: 10,
    fontWeight: '500',
  },
  tierCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tierHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  tierTitle: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '700',
  },
  tierSubtitle: {
    color: COLORS.textMuted,
    fontSize: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '800',
  },
  seeAll: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: SPACING.md,
  },
  emptyTitle: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: '800',
    marginBottom: SPACING.sm,
  },
  emptyText: {
    color: COLORS.textMuted,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  shopButton: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.xxl,
    paddingVertical: SPACING.md,
  },
  shopButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '800',
  },
  businessCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  businessCardPressed: {
    backgroundColor: COLORS.surfaceLight,
    transform: [{ scale: 0.98 }],
  },
  bizIconWrap: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
    borderLeftWidth: 3,
    marginRight: SPACING.md,
  },
  bizIcon: {
    fontSize: 22,
  },
  levelPill: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: RADIUS.sm,
  },
  levelPillText: {
    color: '#000',
    fontSize: 9,
    fontWeight: '800',
  },
  bizInfo: {
    flex: 1,
    marginRight: SPACING.sm,
    gap: 4,
  },
  bizTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bizName: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '700',
    flex: 1,
    marginRight: SPACING.sm,
  },
  bizIncome: {
    color: COLORS.success,
    fontSize: 13,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  bizBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bizNext: {
    color: COLORS.success,
    fontSize: 11,
    fontWeight: '600',
  },
  bizLevel: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontVariant: ['tabular-nums'],
  },
  upgradeBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surfaceLight,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    minWidth: 68,
  },
  upgradeBtnActive: {
    backgroundColor: COLORS.primary + '20',
    borderWidth: 1,
    borderColor: COLORS.primary + '40',
  },
  upgradeBtnText: {
    fontSize: 16,
    marginBottom: 2,
  },
  upgradeCost: {
    color: COLORS.primary,
    fontSize: 11,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
});
