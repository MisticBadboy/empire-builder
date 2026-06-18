import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { useGameStore } from '../../store/useGameStore';
import { BUSINESS_DEFS, getUpgradeCost, getBusinessIncome } from '../../store/businessDefs';
import { COLORS, SPACING, RADIUS } from '../../constants/theme';
import { TIERS } from '../../constants/tiers';
import { formatMoney, formatIncome } from '../../utils/formatters';
import { hapticLight, hapticMedium } from '../../utils/haptics';
import ProgressBar from '../../components/ProgressBar';

export default function BusinessDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();

  const cash = useGameStore((s) => s.cash);
  const businesses = useGameStore((s) => s.businesses);
  const buyBusiness = useGameStore((s) => s.buyBusiness);

  const business = BUSINESS_DEFS.find((b) => b.id === id);
  if (!business) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backText}>← Back</Text>
          </Pressable>
        </View>
        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>Business not found</Text>
        </View>
      </View>
    );
  }

  const bizState = businesses[business.id];
  const level = bizState?.level ?? 0;
  const isOwned = level > 0;
  const isMaxed = level >= business.maxLevel;

  const currentCost = isOwned ? getUpgradeCost(business, level) : business.baseCost;
  const currentIncome = isOwned ? getBusinessIncome(business, level) : 0;
  const nextIncome = getBusinessIncome(business, level + 1);
  const canAfford = cash >= currentCost;
  const tierDef = TIERS[business.tier - 1];
  const tierColor = tierDef?.color ?? COLORS.primary;
  const progress = level / business.maxLevel;

  const handlePurchase = () => {
    if (!canAfford || isMaxed) return;
    hapticMedium();
    buyBusiness(business.id);
  };

  // Next 5 upgrade previews
  const upgradePreviews = [];
  for (let i = 1; i <= 5; i++) {
    const previewLevel = level + i;
    if (previewLevel > business.maxLevel) break;
    upgradePreviews.push({
      level: previewLevel,
      cost: getUpgradeCost(business, previewLevel - 1),
      income: getBusinessIncome(business, previewLevel),
    });
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + SPACING.sm },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header with back button */}
        <View style={styles.header}>
          <Pressable onPress={() => { hapticLight(); router.back(); }} style={styles.backBtn}>
            <Text style={styles.backArrow}>←</Text>
            <Text style={styles.backText}>Back</Text>
          </Pressable>
        </View>

        {/* Business Hero */}
        <View style={styles.heroSection}>
          <View style={[styles.iconHero, { backgroundColor: tierColor + '20', borderColor: tierColor + '40' }]}>
            <Text style={styles.iconEmoji}>{business.icon}</Text>
          </View>
          <Text style={styles.businessName}>{business.name}</Text>
          <Text style={styles.businessDesc}>{business.description}</Text>
          <View style={[styles.tierBadge, { backgroundColor: tierColor + '20', borderColor: tierColor + '60' }]}>
            <Text style={[styles.tierBadgeText, { color: tierColor }]}>
              Tier {business.tier} — {tierDef?.name}
            </Text>
          </View>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Level</Text>
            <Text style={styles.statValue}>{level}/{business.maxLevel}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Income</Text>
            <Text style={[styles.statValue, { color: COLORS.success }]}>
              {isOwned ? formatIncome(currentIncome) : 'None'}
            </Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Total Invested</Text>
            <Text style={styles.statValue}>{formatMoney(bizState?.totalInvested ?? 0)}</Text>
          </View>
        </View>

        {/* Level Progress */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Progress</Text>
          <ProgressBar
            progress={progress}
            color={tierColor}
            height={10}
            showText
            label={`Level ${level} → ${business.maxLevel}`}
          />
        </View>

        {/* Buy / Upgrade Button */}
        {!isMaxed ? (
          <Pressable
            style={[
              styles.buyButton,
              canAfford ? styles.buyButtonActive : styles.buyButtonDisabled,
            ]}
            onPress={handlePurchase}
          >
            <Text style={styles.buyButtonTitle}>
              {isOwned ? '⬆️ Upgrade' : '🛒 Purchase'}
            </Text>
            <Text style={styles.buyButtonCost}>{formatMoney(currentCost)}</Text>
            {isOwned && (
              <Text style={styles.buyButtonIncome}>
                +{formatIncome(nextIncome - currentIncome)}
              </Text>
            )}
            {!isOwned && (
              <Text style={styles.buyButtonIncome}>
                Start earning {formatIncome(getBusinessIncome(business, 1))}
              </Text>
            )}
          </Pressable>
        ) : (
          <View style={styles.maxedBanner}>
            <Text style={styles.maxedEmoji}>🏆</Text>
            <Text style={styles.maxedText}>Fully Maxed!</Text>
          </View>
        )}

        {/* Upgrade Preview */}
        {upgradePreviews.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Next Upgrades</Text>
            {upgradePreviews.map((upg) => {
              const upgCanAfford = cash >= upg.cost;
              return (
                <View key={upg.level} style={[styles.upgradeRow, !upgCanAfford && styles.upgradeRowDim]}>
                  <View style={styles.upgradeLeft}>
                    <Text style={styles.upgradeLevel}>Lv. {upg.level}</Text>
                    <Text style={styles.upgradeIncome}>→ {formatIncome(upg.income)}</Text>
                  </View>
                  <Text style={[styles.upgradeCost, !upgCanAfford && { color: COLORS.textDim }]}>
                    {formatMoney(upg.cost)}
                  </Text>
                </View>
              );
            })}
          </View>
        )}

        {/* Category Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Details</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Category</Text>
            <Text style={styles.detailValue}>{business.category.replace('_', ' ')}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Base Cost</Text>
            <Text style={styles.detailValue}>{formatMoney(business.baseCost)}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Base Income</Text>
            <Text style={styles.detailValue}>{formatIncome(business.baseIncome)}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Cost Multiplier</Text>
            <Text style={styles.detailValue}>×{business.costMultiplier}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Max Level</Text>
            <Text style={styles.detailValue}>{business.maxLevel}</Text>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
  },
  header: {
    marginBottom: SPACING.md,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.xs,
  },
  backArrow: {
    color: COLORS.primary,
    fontSize: 20,
    fontWeight: '700',
    marginRight: SPACING.xs,
  },
  backText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  notFound: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notFoundText: {
    color: COLORS.textMuted,
    fontSize: 16,
  },
  // Hero
  heroSection: {
    alignItems: 'center',
    paddingBottom: SPACING.xl,
  },
  iconHero: {
    width: 80,
    height: 80,
    borderRadius: RADIUS.xl,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    marginBottom: SPACING.md,
  },
  iconEmoji: {
    fontSize: 36,
  },
  businessName: {
    color: COLORS.text,
    fontSize: 24,
    fontWeight: '800',
    marginBottom: SPACING.xs,
  },
  businessDesc: {
    color: COLORS.textMuted,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  tierBadge: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
    borderWidth: 1,
  },
  tierBadgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  // Stats Row
  statsRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
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
  statLabel: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 4,
  },
  statValue: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  // Sections
  section: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: SPACING.sm,
  },
  // Buy Button
  buyButton: {
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  buyButtonActive: {
    backgroundColor: COLORS.primary,
  },
  buyButtonDisabled: {
    backgroundColor: COLORS.surfaceLight,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  buyButtonTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 4,
  },
  buyButtonCost: {
    fontSize: 20,
    fontWeight: '900',
    fontVariant: ['tabular-nums'],
  },
  buyButtonIncome: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 4,
    opacity: 0.8,
  },
  // Maxed
  maxedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary + '15',
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.primary + '30',
  },
  maxedEmoji: {
    fontSize: 20,
    marginRight: SPACING.sm,
  },
  maxedText: {
    color: COLORS.primary,
    fontSize: 18,
    fontWeight: '800',
  },
  // Upgrade Previews
  upgradeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 2,
    marginBottom: SPACING.xs,
  },
  upgradeRowDim: {
    opacity: 0.5,
  },
  upgradeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  upgradeLevel: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '700',
  },
  upgradeIncome: {
    color: COLORS.success,
    fontSize: 13,
    fontWeight: '600',
  },
  upgradeCost: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  // Details
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  detailLabel: {
    color: COLORS.textMuted,
    fontSize: 13,
  },
  detailValue: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
});
