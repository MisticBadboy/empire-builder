import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import { BusinessDef, getUpgradeCost, getBusinessIncome } from '../store/businessDefs';
import { formatMoney, formatIncome } from '../utils/formatters';
import { hapticLight, hapticMedium } from '../utils/haptics';
import ProgressBar from './ProgressBar';
import { TIERS } from '../constants/tiers';

interface BusinessCardProps {
  business: BusinessDef;
  level: number;
  cash: number;
  onPurchase: () => void;
}

export default function BusinessCard({ business, level, cash, onPurchase }: BusinessCardProps) {
  const isOwned = level > 0;
  const isMaxed = level >= business.maxLevel;
  const upgradeCost = isOwned ? getUpgradeCost(business, level) : business.baseCost;
  const currentIncome = isOwned ? getBusinessIncome(business, level) : 0;
  const nextIncome = getBusinessIncome(business, level + 1);
  const canAfford = cash >= upgradeCost;
  const tierColor = TIERS[business.tier - 1]?.color ?? COLORS.primary;
  const progress = level / business.maxLevel;

  const handlePress = () => {
    if (canAfford && !isMaxed) {
      hapticMedium();
      onPurchase();
    } else {
      hapticLight();
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.card,
        pressed && styles.cardPressed,
        !canAfford && !isMaxed && styles.cardDisabled,
      ]}
    >
      {/* Left: Icon + Tier indicator */}
      <View style={[styles.iconContainer, { borderLeftColor: tierColor }]}>
        <Text style={styles.icon}>{business.icon}</Text>
        {isOwned && (
          <View style={[styles.levelBadge, { backgroundColor: tierColor }]}>
            <Text style={styles.levelText}>Lv{level}</Text>
          </View>
        )}
      </View>

      {/* Center: Info */}
      <View style={styles.info}>
        <View style={styles.nameRow}>
          <Text style={styles.name} numberOfLines={1}>{business.name}</Text>
          {isOwned && (
            <Text style={[styles.income, { color: COLORS.success }]}>
              {formatIncome(currentIncome)}
            </Text>
          )}
        </View>

        {isOwned ? (
          <View style={styles.upgradeRow}>
            <ProgressBar
              progress={progress}
              color={tierColor}
              height={6}
            />
            {isMaxed ? (
              <Text style={styles.maxedText}>MAX</Text>
            ) : (
              <View style={styles.upgradeInfo}>
                <Text style={styles.nextIncome}>
                  → {formatIncome(nextIncome)}
                </Text>
                <Text style={[styles.levelProgress, { color: COLORS.textMuted }]}>
                  {level}/{business.maxLevel}
                </Text>
              </View>
            )}
          </View>
        ) : (
          <Text style={styles.description} numberOfLines={1}>
            {business.description}
          </Text>
        )}
      </View>

      {/* Right: Price button */}
      <View style={[styles.priceButton, canAfford && !isMaxed && styles.priceButtonActive]}>
        <Text style={[styles.priceLabel, !isOwned && styles.buyLabel]}>
          {isMaxed ? '✅' : isOwned ? '⬆️' : '🛒'}
        </Text>
        <Text
          style={[styles.priceText, !canAfford && !isMaxed && styles.priceTextDisabled]}
          numberOfLines={1}
          adjustsFontSizeToFit
        >
          {isMaxed ? 'MAX' : formatMoney(upgradeCost)}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardPressed: {
    backgroundColor: COLORS.surfaceLight,
    transform: [{ scale: 0.98 }],
  },
  cardDisabled: {
    opacity: 0.6,
  },
  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
    borderLeftWidth: 3,
    marginRight: SPACING.md,
  },
  icon: {
    fontSize: 24,
  },
  levelBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: RADIUS.sm,
  },
  levelText: {
    color: '#000',
    fontSize: 9,
    fontWeight: '800',
  },
  info: {
    flex: 1,
    marginRight: SPACING.sm,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '700',
    flex: 1,
    marginRight: SPACING.sm,
  },
  income: {
    fontSize: 13,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  description: {
    color: COLORS.textMuted,
    fontSize: 12,
  },
  upgradeRow: {
    gap: 4,
  },
  upgradeInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nextIncome: {
    color: COLORS.success,
    fontSize: 11,
    fontWeight: '600',
  },
  levelProgress: {
    fontSize: 11,
    fontVariant: ['tabular-nums'],
  },
  maxedText: {
    color: COLORS.primary,
    fontSize: 11,
    fontWeight: '800',
    textAlign: 'right',
    marginTop: 2,
  },
  priceButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surfaceLight,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    minWidth: 72,
  },
  priceButtonActive: {
    backgroundColor: COLORS.primary + '20',
    borderWidth: 1,
    borderColor: COLORS.primary + '40',
  },
  priceLabel: {
    fontSize: 16,
    marginBottom: 2,
  },
  buyLabel: {
    fontSize: 14,
  },
  priceText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  priceTextDisabled: {
    color: COLORS.textDim,
  },
});
