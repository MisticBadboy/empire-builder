import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useGameStore } from '../../store/useGameStore';
import { BUSINESS_DEFS, getBusinessIncome } from '../../store/businessDefs';
import { ACHIEVEMENT_DEFS } from '../../store/achievements';
import { COLORS, SPACING, RADIUS } from '../../constants/theme';
import { TIERS } from '../../constants/tiers';
import { formatMoney, formatIncome } from '../../utils/formatters';
import { hapticLight, hapticMedium } from '../../utils/haptics';
import { areAdsRemoved } from '../../services/adService';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { isSignedIn, getAccount } from '../../services/authService';

export default function StatsScreen() {
  const router = useRouter();
  const cash = useGameStore((s) => s.cash);
  const totalEarned = useGameStore((s) => s.totalEarned);
  const businesses = useGameStore((s) => s.businesses);
  const achievements = useGameStore((s) => s.achievements);
  const highestTier = useGameStore((s) => s.highestTier);
  const totalPurchases = useGameStore((s) => s.totalPurchases);
  const totalAdsWatched = useGameStore((s) => s.totalAdsWatched);
  const getNetWorth = useGameStore((s) => s.getNetWorth);
  const getIncomePerSec = useGameStore((s) => s.getIncomePerSec);
  const loadGame = useGameStore((s) => s.load);
  const [adsRemoved, setAdsRemoved] = useState(areAdsRemoved());

  useEffect(() => {
    const check = async () => setAdsRemoved(areAdsRemoved());
    check();
  }, []);

  const netWorth = getNetWorth();
  const incomePerSec = getIncomePerSec();
  const ownedCount = Object.keys(businesses).length;
  const totalLevels = Object.values(businesses).reduce((sum, b) => sum + b.level, 0);

  // Find most profitable business (using new income formula)
  let bestIncome = 0;
  let bestBusiness = 'None';
  for (const [id, owned] of Object.entries(businesses)) {
    if (owned.level > 0) {
      const def = BUSINESS_DEFS.find((d) => d.id === id);
      if (def) {
        const income = getBusinessIncome(def, owned.level);
        if (income > bestIncome) {
          bestIncome = income;
          bestBusiness = def.name;
        }
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
            hapticMedium();
            try {
              await AsyncStorage.removeItem('empire_builder_save_v2');
              await AsyncStorage.removeItem('empire_builder_save');
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

        {/* Net Worth */}
        <View style={styles.netWorthCard}>
          <Text style={styles.netWorthLabel}>NET WORTH</Text>
          <Text style={styles.netWorthValue}>{formatMoney(netWorth)}</Text>
          <Text style={[styles.tierLabel, { color: TIERS[highestTier - 1]?.color }]}>
            {TIERS[highestTier - 1]?.name}
          </Text>
        </View>

        {/* Stats Grid */}
        <View style={styles.grid}>
          <StatBox label="Cash" value={formatMoney(cash)} />
          <StatBox label="Income/s" value={formatIncome(incomePerSec)} />
          <StatBox label="Total Earned" value={formatMoney(totalEarned)} />
          <StatBox label="Businesses" value={`${ownedCount}/${BUSINESS_DEFS.length}`} />
          <StatBox label="Total Levels" value={totalLevels.toString()} />
          <StatBox label="Purchases" value={totalPurchases.toString()} />
          <StatBox label="Best Earner" value={bestBusiness} />
          <StatBox label="Best Income/s" value={formatMoney(bestIncome)} />
          <StatBox label="Ads Watched" value={totalAdsWatched.toString()} />
          <StatBox label="Status" value={adsRemoved ? '🚫 Ad-Free' : '📺 Ads Active'} />
        </View>

        {/* Remove Ads Card */}
        {!adsRemoved && (
          <Pressable
            style={styles.removeAdsCard}
            onPress={() => {
              hapticLight();
              router.push('/remove-ads');
            }}
          >
            <View style={styles.removeAdsLeft}>
              <Text style={styles.removeAdsIcon}>🚫</Text>
              <View>
                <Text style={styles.removeAdsTitle}>Remove All Ads — $4.99</Text>
                <Text style={styles.removeAdsSub}>No popups, no banners, no interruptions</Text>
              </View>
            </View>
            <Text style={styles.removeAdsArrow}>→</Text>
          </Pressable>
        )}

        {/* Account Linking */}
        <Pressable
          style={styles.accountCard}
          onPress={() => {
            hapticLight();
            router.push('/account');
          }}
        >
          <View style={styles.removeAdsLeft}>
            <Text style={styles.removeAdsIcon}>🔗</Text>
            <View>
              <Text style={styles.removeAdsTitle}>Link Account</Text>
              <Text style={styles.removeAdsSub}>
                {isSignedIn() ? `Signed in (${getAccount()?.provider}) — Cloud sync active` : 'Sign in with Google or Apple for cloud saves'}
              </Text>
            </View>
          </View>
          <Text style={styles.removeAdsArrow}>→</Text>
        </Pressable>

        {/* Achievements */}
        <Text style={styles.sectionTitle}>🏆 Achievements ({achievements.length}/{ACHIEVEMENT_DEFS.length})</Text>
        {ACHIEVEMENT_DEFS.map((ach) => {
          const unlocked = achievements.includes(ach.id);
          return (
            <View key={ach.id} style={[styles.achieveCard, !unlocked && styles.achieveLocked]}>
              <Text style={styles.achieveIcon}>{unlocked ? ach.icon : '🔒'}</Text>
              <View style={{ flex: 1 }}>
                <Text style={[styles.achieveName, !unlocked && styles.achieveNameLocked]}>
                  {ach.name}
                </Text>
                <Text style={styles.achieveDesc}>{ach.description}</Text>
              </View>
              {unlocked && <Text style={styles.achieveCheck}>✅</Text>}
            </View>
          );
        })}

        {/* Reset */}
        <Pressable style={styles.resetButton} onPress={handleReset}>
          <Text style={styles.resetText}>🗑️ Reset Game</Text>
        </Pressable>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statBox}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  container: { flex: 1 },
  content: { paddingHorizontal: SPACING.lg, paddingTop: SPACING.md },
  title: { color: COLORS.primary, fontSize: 20, fontWeight: '900', letterSpacing: 2, marginBottom: SPACING.md },
  netWorthCard: {
    backgroundColor: COLORS.surface, borderRadius: RADIUS.lg,
    padding: SPACING.xl, alignItems: 'center', marginBottom: SPACING.md,
    borderWidth: 1, borderColor: COLORS.primary + '40',
  },
  netWorthLabel: { color: COLORS.textMuted, fontSize: 11, fontWeight: '600', letterSpacing: 3, marginBottom: 4 },
  netWorthValue: { color: COLORS.primary, fontSize: 28, fontWeight: '900', fontVariant: ['tabular-nums'], marginBottom: 4 },
  tierLabel: { fontSize: 14, fontWeight: '700' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm, marginBottom: SPACING.md },
  statBox: {
    width: '48%', flexGrow: 1, backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md, padding: SPACING.md, borderWidth: 1, borderColor: COLORS.border,
  },
  statLabel: { color: COLORS.textMuted, fontSize: 10, fontWeight: '600', letterSpacing: 1, marginBottom: 4 },
  statValue: { color: COLORS.text, fontSize: 14, fontWeight: '700', fontVariant: ['tabular-nums'] },
  removeAdsCard: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: COLORS.primary + '10', borderRadius: RADIUS.lg,
    padding: SPACING.md, marginBottom: SPACING.md, borderWidth: 1, borderColor: COLORS.primary + '30',
  },
  accountCard: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: COLORS.secondary + '10', borderRadius: RADIUS.lg,
    padding: SPACING.md, marginBottom: SPACING.md, borderWidth: 1, borderColor: COLORS.secondary + '30',
  },
  removeAdsLeft: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, flex: 1 },
  removeAdsIcon: { fontSize: 28 },
  removeAdsTitle: { color: COLORS.primary, fontSize: 14, fontWeight: '800' },
  removeAdsSub: { color: COLORS.textMuted, fontSize: 11, marginTop: 2 },
  removeAdsArrow: { color: COLORS.primary, fontSize: 18, fontWeight: '700' },
  sectionTitle: { color: COLORS.text, fontSize: 16, fontWeight: '700', marginBottom: SPACING.sm, marginTop: SPACING.sm },
  achieveCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md, padding: SPACING.md, marginBottom: SPACING.sm,
    borderWidth: 1, borderColor: COLORS.border,
  },
  achieveLocked: { opacity: 0.5 },
  achieveIcon: { fontSize: 24, marginRight: SPACING.md },
  achieveName: { color: COLORS.text, fontSize: 13, fontWeight: '700' },
  achieveNameLocked: { color: COLORS.textMuted },
  achieveDesc: { color: COLORS.textMuted, fontSize: 11, marginTop: 2 },
  achieveCheck: { fontSize: 16 },
  resetButton: {
    backgroundColor: COLORS.danger + '20', borderRadius: RADIUS.md,
    padding: SPACING.md, alignItems: 'center', borderWidth: 1, borderColor: COLORS.danger + '40',
    marginTop: SPACING.lg,
  },
  resetText: { color: COLORS.danger, fontSize: 14, fontWeight: '700' },
});
