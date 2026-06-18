import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGameStore } from '../../store/useGameStore';
import { useGameLoop } from '../../utils/useGameLoop';
import { BUSINESS_DEFS, getUpgradeCost, getBusinessIncome, getMilestoneMultiplier, getNextMilestone } from '../../store/businessDefs';
import { COLORS, SPACING, RADIUS } from '../../constants/theme';
import { TIERS } from '../../constants/tiers';
import { formatMoney, formatIncome, formatTime } from '../../utils/formatters';
import { hapticLight, hapticMedium } from '../../utils/haptics';
import MoneyCounter from '../../components/MoneyCounter';
import ProgressBar from '../../components/ProgressBar';
import { useRouter } from 'expo-router';

export default function DashboardScreen() {
  useGameLoop();
  const router = useRouter();

  const cash = useGameStore((s) => s.cash);
  const businesses = useGameStore((s) => s.businesses);
  const highestTier = useGameStore((s) => s.highestTier);
  const buyBusiness = useGameStore((s) => s.buyBusiness);
  const getNetWorth = useGameStore((s) => s.getNetWorth);
  const getIncomePerSec = useGameStore((s) => s.getIncomePerSec);
  const boostMultiplier = useGameStore((s) => s.boostMultiplier);
  const boostExpiresAt = useGameStore((s) => s.boostExpiresAt);
  const watchAdBoostFn = useGameStore((s) => s.watchAdBoost);
  const watchAdCashBonusFn = useGameStore((s) => s.watchAdCashBonus);

  const netWorth = getNetWorth();
  const incomePerSec = getIncomePerSec();
  const [boostRemaining, setBoostRemaining] = useState(0);
  const [adCooldown, setAdCooldown] = useState(0);
  const [canWatchAd, setCanWatchAd] = useState(true);

  // Update boost timer and ad cooldown every second
  useEffect(() => {
    const interval = setInterval(() => {
      const state = useGameStore.getState();
      setBoostRemaining(state.getBoostTimeRemaining());
      setAdCooldown(state.getAdCooldown());
      setCanWatchAd(state.canWatchAd());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const currentTier = TIERS[highestTier - 1];
  const nextTierUnlock = (() => {
    const next = TIERS[highestTier];
    if (!next) return null;
    return next;
  })();

  // Find best upgrade
  let bestId = '';
  let bestCost = Infinity;
  let bestNewIncome = 0;
  for (const def of BUSINESS_DEFS) {
    if (def.tier > highestTier) continue;
    const level = businesses[def.id]?.level ?? 0;
    if (level >= def.maxLevel) continue;
    const cost = getUpgradeCost(def, level);
    if (cost <= cash && cost < bestCost) {
      bestId = def.id;
      bestCost = cost;
      bestNewIncome = getBusinessIncome(def, level + 1);
    }
  }
  const bestDef = BUSINESS_DEFS.find((b) => b.id === bestId);

  // Top 5 earners
  const ownedBusinesses = Object.entries(businesses)
    .map(([id, save]) => {
      const def = BUSINESS_DEFS.find((b) => b.id === id);
      if (!def) return null;
      return { def, ...save };
    })
    .filter(Boolean)
    .sort((a, b) => {
      const aInc = a ? getBusinessIncome(a.def, a.level) : 0;
      const bInc = b ? getBusinessIncome(b.def, b.level) : 0;
      return bInc - aInc;
    })
    .slice(0, 5);

  return (
    <SafeAreaView style={styles.safe} edges={['left', 'right']}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Boost Banner */}
        {boostMultiplier > 1 && boostRemaining > 0 && (
          <View style={styles.boostBanner}>
            <Text style={styles.boostIcon}>⚡</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.boostText}>
                {boostMultiplier}x BOOST ACTIVE
              </Text>
              <Text style={styles.boostTimer}>{formatTime(boostRemaining)} remaining</Text>
            </View>
            <View style={styles.boostBadge}>
              <Text style={styles.boostBadgeText}>+{((boostMultiplier - 1) * 100)}%</Text>
            </View>
          </View>
        )}

        {/* Hero Cash */}
        <View style={styles.cashSection}>
          <Text style={styles.cashLabel}>CASH</Text>
          <MoneyCounter amount={cash} size={32} showLabel="" />
          <Text style={styles.incomePerSec}>
            {formatIncome(incomePerSec * boostMultiplier)}/s
            {boostMultiplier > 1 && (
              <Text style={{ color: COLORS.success }}> ⚡</Text>
            )}
          </Text>
        </View>

        {/* Ad Buttons Row */}
        <View style={styles.adRow}>
          <Pressable
            style={[styles.adButton, !canWatchAd && styles.adButtonDisabled]}
            onPress={() => {
              hapticMedium();
              watchAdBoostFn();
            }}
            disabled={!canWatchAd}
          >
            <Text style={styles.adButtonIcon}>⚡</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.adButtonTitle}>2x Boost</Text>
              <Text style={styles.adButtonSub}>
                {canWatchAd ? '5 minutes' : `${formatTime(adCooldown)} cooldown`}
              </Text>
            </View>
            <Text style={styles.adButtonBadge}>AD</Text>
          </Pressable>

          <Pressable
            style={[styles.adButton, !canWatchAd && styles.adButtonDisabled]}
            onPress={() => {
              hapticMedium();
              watchAdCashBonusFn();
            }}
            disabled={!canWatchAd}
          >
            <Text style={styles.adButtonIcon}>💰</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.adButtonTitle}>Cash Bonus</Text>
              <Text style={styles.adButtonSub}>
                {canWatchAd ? 'Instant cash' : `${formatTime(adCooldown)} cooldown`}
              </Text>
            </View>
            <Text style={styles.adButtonBadge}>AD</Text>
          </Pressable>
        </View>

        {/* Net Worth */}
        <View style={styles.netWorthSection}>
          <View style={styles.netWorthRow}>
            <Text style={styles.netWorthLabel}>NET WORTH</Text>
            <Text style={styles.netWorthValue}>{formatMoney(netWorth)}</Text>
          </View>
          {nextTierUnlock && (
            <>
              <View style={styles.tierHeader}>
                <Text style={[styles.tierName, { color: currentTier?.color }]}>
                  {currentTier?.name}
                </Text>
                <Text style={styles.tierCount}>Tier {highestTier}/6</Text>
              </View>
              <ProgressBar
                progress={(netWorth - currentTier.unlockNetWorth) / (nextTierUnlock.unlockNetWorth - currentTier.unlockNetWorth)}
                color={currentTier?.color}
                height={6}
                showText
              />
              <Text style={styles.tierHint}>
                {formatMoney(netWorth)} / {formatMoney(nextTierUnlock.unlockNetWorth)} for {nextTierUnlock.name}
              </Text>
            </>
          )}
          {!nextTierUnlock && (
            <Text style={[styles.tierHint, { color: COLORS.primary }]}>
              🏆 Maximum tier reached!
            </Text>
          )}
        </View>

        {/* Quick Upgrade */}
        {bestDef && (
          <Pressable
            style={styles.upgradeCard}
            onPress={() => {
              hapticMedium();
              const ok = buyBusiness(bestId);
              if (!ok) hapticLight();
            }}
          >
            <View style={styles.upgradeLeft}>
              <Text style={styles.upgradeLabel}>⚡ BEST UPGRADE</Text>
              <Text style={styles.upgradeBizName}>
                {bestDef.icon} {bestDef.name}
              </Text>
              <Text style={styles.upgradeNewIncome}>
                → {formatIncome(bestNewIncome)}/s
              </Text>
            </View>
            <View style={styles.upgradeRight}>
              <Text style={styles.upgradeCost}>{formatMoney(bestCost)}</Text>
              <Text style={styles.upgradeArrow}>⬆️</Text>
            </View>
          </Pressable>
        )}

        {/* Top Earners */}
        {ownedBusinesses.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>💰 TOP EARNERS</Text>
            {ownedBusinesses.map((biz) => {
              if (!biz) return null;
              const income = getBusinessIncome(biz.def, biz.level);
              const milestone = getNextMilestone(biz.level);
              return (
                <Pressable
                  key={biz.def.id}
                  style={styles.earnerCard}
                  onPress={() => router.push(`/business/${biz.def.id}`)}
                >
                  <Text style={styles.earnerIcon}>{biz.def.icon}</Text>
                  <View style={styles.earnerInfo}>
                    <Text style={styles.earnerName}>{biz.def.name}</Text>
                    <Text style={styles.earnerIncome}>{formatIncome(income)}/s</Text>
                    {milestone && (
                      <Text style={styles.earnerMilestone}>
                        Next: Lv{milestone.level} → x{milestone.multiplier}
                      </Text>
                    )}
                  </View>
                  <View style={styles.earnerLevel}>
                    <Text style={styles.earnerLevelText}>Lv{biz.level}</Text>
                  </View>
                </Pressable>
              );
            })}
          </>
        )}

        {/* All Businesses */}
        <Text style={styles.sectionTitle}>🏪 ALL BUSINESSES</Text>
        {BUSINESS_DEFS.filter((b) => b.tier <= highestTier).map((def) => {
          const level = businesses[def.id]?.level ?? 0;
          const isMaxed = level >= def.maxLevel;
          const cost = getUpgradeCost(def, level);
          const income = getBusinessIncome(def, level);
          const canAfford = cash >= cost && !isMaxed;
          const tierColor = TIERS[def.tier - 1]?.color ?? COLORS.primary;

          return (
            <Pressable
              key={def.id}
              style={[styles.bizCard, !canAfford && !isMaxed && styles.bizCardDisabled]}
              onPress={() => {
                hapticMedium();
                if (canAfford) {
                  buyBusiness(def.id);
                } else {
                  router.push(`/business/${def.id}`);
                }
              }}
            >
              <Text style={styles.bizIcon}>{def.icon}</Text>
              <View style={styles.bizInfo}>
                <View style={styles.bizNameRow}>
                  <Text style={styles.bizName}>{def.name}</Text>
                  {income > 0 && (
                    <Text style={[styles.bizIncome, { color: COLORS.success }]}>
                      {formatIncome(income)}
                    </Text>
                  )}
                </View>
                {level > 0 && !isMaxed && (
                  <Text style={styles.bizLevel}>
                    Lv{level}/{def.maxLevel} → {formatIncome(getBusinessIncome(def, level + 1))}
                  </Text>
                )}
                {isMaxed && <Text style={styles.bizMaxed}>✅ MAXED</Text>}
              </View>
              {!isMaxed && (
                <View style={[styles.bizBuyBtn, canAfford && styles.bizBuyBtnActive]}>
                  <Text style={[styles.bizPrice, !canAfford && { color: COLORS.textDim }]}>
                    {formatMoney(cost)}
                  </Text>
                </View>
              )}
            </Pressable>
          );
        })}

        {/* Spacer for tab bar */}
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  container: { flex: 1 },
  content: { paddingHorizontal: SPACING.lg, paddingTop: SPACING.md },

  // Boost banner
  boostBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.success + '15',
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.success + '40',
  },
  boostIcon: { fontSize: 24, marginRight: SPACING.md },
  boostText: { color: COLORS.success, fontSize: 14, fontWeight: '800' },
  boostTimer: { color: COLORS.success, fontSize: 11, opacity: 0.8, marginTop: 2 },
  boostBadge: {
    backgroundColor: COLORS.success + '30',
    borderRadius: RADIUS.sm,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  boostBadgeText: { color: COLORS.success, fontSize: 12, fontWeight: '800' },

  // Cash
  cashSection: { alignItems: 'center', paddingVertical: SPACING.lg },
  cashLabel: {
    color: COLORS.textMuted, fontSize: 11, fontWeight: '600',
    letterSpacing: 3, marginBottom: 4,
  },
  incomePerSec: {
    color: COLORS.success, fontSize: 14, fontWeight: '700',
    marginTop: 4,
  },

  // Ad buttons
  adRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  adButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.primary + '30',
  },
  adButtonDisabled: {
    opacity: 0.5,
    borderColor: COLORS.border,
  },
  adButtonIcon: { fontSize: 22, marginRight: SPACING.sm },
  adButtonTitle: { color: COLORS.text, fontSize: 13, fontWeight: '700' },
  adButtonSub: { color: COLORS.textMuted, fontSize: 10, marginTop: 1 },
  adButtonBadge: {
    backgroundColor: COLORS.primary + '20',
    color: COLORS.primary,
    fontSize: 9,
    fontWeight: '800',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: 'hidden',
  },

  // Net worth
  netWorthSection: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  netWorthRow: { marginBottom: SPACING.md },
  netWorthLabel: {
    color: COLORS.textMuted, fontSize: 11, fontWeight: '600',
    letterSpacing: 2, marginBottom: 2,
  },
  netWorthValue: {
    color: COLORS.text, fontSize: 20, fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  tierHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 6,
  },
  tierName: { fontSize: 16, fontWeight: '800' },
  tierCount: { color: COLORS.textMuted, fontSize: 12 },
  tierHint: { color: COLORS.textMuted, fontSize: 11, marginTop: 6 },

  // Upgrade card
  upgradeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.primary + '10',
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    borderWidth: 1.5,
    borderColor: COLORS.primary + '40',
  },
  upgradeLeft: { flex: 1 },
  upgradeLabel: {
    color: COLORS.primary, fontSize: 10, fontWeight: '700',
    letterSpacing: 1, marginBottom: 4,
  },
  upgradeBizName: {
    color: COLORS.text, fontSize: 16, fontWeight: '800',
  },
  upgradeNewIncome: {
    color: COLORS.success, fontSize: 13, fontWeight: '600', marginTop: 4,
  },
  upgradeRight: { alignItems: 'center' },
  upgradeCost: {
    color: COLORS.primary, fontSize: 16, fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  upgradeArrow: { fontSize: 18, marginTop: 4 },

  // Section titles
  sectionTitle: {
    color: COLORS.primary, fontSize: 13, fontWeight: '700',
    letterSpacing: 1, marginBottom: SPACING.md, marginTop: SPACING.sm,
  },

  // Top earners
  earnerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  earnerIcon: { fontSize: 28, marginRight: SPACING.md },
  earnerInfo: { flex: 1 },
  earnerName: { color: COLORS.text, fontSize: 14, fontWeight: '700' },
  earnerIncome: { color: COLORS.success, fontSize: 12, fontWeight: '600' },
  earnerMilestone: { color: COLORS.warning, fontSize: 10, marginTop: 2, fontWeight: '600' },
  earnerLevel: {
    backgroundColor: COLORS.surfaceLight,
    borderRadius: RADIUS.sm,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  earnerLevelText: {
    color: COLORS.textMuted, fontSize: 11, fontWeight: '700',
  },

  // Business cards
  bizCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  bizCardDisabled: { opacity: 0.5 },
  bizIcon: { fontSize: 28, marginRight: SPACING.md },
  bizInfo: { flex: 1 },
  bizNameRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center',
  },
  bizName: { color: COLORS.text, fontSize: 14, fontWeight: '700' },
  bizIncome: { fontSize: 12, fontWeight: '700' },
  bizLevel: { color: COLORS.textMuted, fontSize: 11, marginTop: 2 },
  bizMaxed: { color: COLORS.primary, fontSize: 11, fontWeight: '700', marginTop: 2 },
  bizBuyBtn: {
    backgroundColor: COLORS.surfaceLight,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    marginLeft: SPACING.sm,
  },
  bizBuyBtnActive: {
    backgroundColor: COLORS.primary + '20',
    borderWidth: 1,
    borderColor: COLORS.primary + '40',
  },
  bizPrice: {
    color: COLORS.primary, fontSize: 12, fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
});
