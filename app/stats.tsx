import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Pressable,
  Alert,
} from 'react-native';
import { useGameStore } from '../store/useGameStore';
import { BUSINESS_DEFS } from '../store/businessDefs';
import { ACHIEVEMENT_DEFS } from '../store/achievements';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import { TIERS } from '../constants/tiers';
import { formatMoney, formatIncome } from '../utils/formatters';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function StatsScreen() {
  const cash = useGameStore((s) => s.cash);
  const totalEarned = useGameStore((s) => s.totalEarned);
  const businesses = useGameStore((s) => s.businesses);
  const achievements = useGameStore((s) => s.achievements);
  const highestTier = useGameStore((s) => s.highestTier);
  const totalPurchases = useGameStore((s) => s.totalPurchases);
  const getNetWorth = useGameStore((s) => s.getNetWorth);
  const getIncomePerSec = useGameStore((s) => s.getIncomePerSec);
  const loadGame = useGameStore((s) => s.load);

  const netWorth = getNetWorth();
  const incomePerSec = getIncomePerSec();
  const ownedCount = Object.keys(businesses).length;
  const maxedCount = Object.values(businesses).filter((b) => b.level >= 100).length;
  const totalInvested = Object.values(businesses).reduce((sum, b) => sum + b.totalInvested, 0);

  let bestBusiness = '';
  let bestIncome = 0;
  for (const [id, owned] of Object.entries(businesses)) {
    const def = BUSINESS_DEFS.find((d) => d.id === id);
    if (def && owned.level > 0) {
      const income = def.baseIncome * (1 + owned.level * 0.1);
      if (income > bestIncome) {
        bestIncome = income;
        bestBusiness = def.name;
      }
    }
  }

  const handleReset = () => {
    Alert.alert(
      '⚠️ Reset Game',
      'This will permanently delete all progress. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('@empire_builder_save');
            } catch {}
            loadGame();
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.title}>📊 STATS</Text>

        <View style={styles.netWorthCard}>
          <Text style={styles.nwLabel}>TOTAL NET WORTH</Text>
          <Text style={styles.nwValue}>{formatMoney(netWorth)}</Text>
          <Text style={styles.nwIncome}>{formatIncome(incomePerSec)}</Text>
        </View>

        <View style={styles.grid}>
          <StatBox label="Cash on Hand" value={formatMoney(cash)} icon="💵" />
          <StatBox label="Total Earned" value={formatMoney(totalEarned)} icon="📈" />
          <StatBox label="Total Invested" value={formatMoney(totalInvested)} icon="🏦" />
          <StatBox label="Businesses" value={`${ownedCount}/${BUSINESS_DEFS.length}`} icon="🏢" />
          <StatBox label="Maxed Out" value={`${maxedCount}`} icon="⬆️" />
          <StatBox label="Total Upgrades" value={`${totalPurchases}`} icon="🛒" />
          <StatBox label="Rank" value={TIERS[highestTier - 1]?.name ?? 'Unknown'} icon="👑" />
          <StatBox label="Best Earner" value={bestBusiness || 'None'} icon="⭐" sub={bestIncome > 0 ? formatIncome(bestIncome) : undefined} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            🏆 Achievements ({achievements.length}/{ACHIEVEMENT_DEFS.length})
          </Text>
          <View style={styles.achieveGrid}>
            {ACHIEVEMENT_DEFS.map((ach) => {
              const unlocked = achievements.includes(ach.id);
              return (
                <View
                  key={ach.id}
                  style={[styles.achieveCard, unlocked && styles.achieveCardUnlocked]}
                >
                  <Text style={[styles.achieveIcon, !unlocked && { opacity: 0.3 }]}>
                    {unlocked ? ach.icon : '🔒'}
                  </Text>
                  <Text
                    style={[styles.achieveName, !unlocked && { color: COLORS.textDim }]}
                    numberOfLines={1}
                  >
                    {ach.name}
                  </Text>
                  <Text
                    style={[styles.achieveDesc, !unlocked && { color: COLORS.textDim }]}
                    numberOfLines={1}
                  >
                    {ach.description}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        <Pressable style={styles.resetButton} onPress={handleReset}>
          <Text style={styles.resetText}>🗑️ Reset Game</Text>
        </Pressable>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function StatBox({ label, value, icon, sub }: { label: string; value: string; icon: string; sub?: string }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statIcon}>{icon}</Text>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue} numberOfLines={1}>{value}</Text>
      {sub && <Text style={styles.statSub}>{sub}</Text>}
    </View>
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
  title: {
    color: COLORS.primary,
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 2,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  netWorthCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.primary + '30',
    marginBottom: SPACING.lg,
  },
  nwLabel: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 2,
    marginBottom: 4,
  },
  nwValue: {
    color: COLORS.primary,
    fontSize: 32,
    fontWeight: '900',
    fontVariant: ['tabular-nums'],
  },
  nwIncome: {
    color: COLORS.success,
    fontSize: 16,
    fontWeight: '700',
    marginTop: 4,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  statCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    width: '48%',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  statLabel: {
    color: COLORS.textMuted,
    fontSize: 10,
    fontWeight: '500',
    marginBottom: 2,
  },
  statValue: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '800',
  },
  statSub: {
    color: COLORS.success,
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  section: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '800',
    marginBottom: SPACING.md,
  },
  achieveGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  achieveCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    width: '48%',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  achieveCardUnlocked: {
    borderColor: COLORS.primary + '40',
    backgroundColor: COLORS.primary + '08',
  },
  achieveIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  achieveName: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: '700',
  },
  achieveDesc: {
    color: COLORS.textMuted,
    fontSize: 10,
    marginTop: 2,
  },
  resetButton: {
    backgroundColor: COLORS.danger + '20',
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.danger + '40',
    marginTop: SPACING.lg,
  },
  resetText: {
    color: COLORS.danger,
    fontSize: 14,
    fontWeight: '700',
  },
});
