/**
 * Account Linking Screen
 * 
 * Shows Google/Apple sign-in options, guest mode, and account status.
 * Once linked, enables cloud saves.
 */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import { hapticLight, hapticMedium } from '../utils/haptics';
import {
  UserAccount,
  loadAccount,
  signInWithGoogle,
  signInWithApple,
  continueAsGuest,
  signOut,
  onAccountChange,
  cloudSave,
  cloudLoad,
  getLastCloudSaveTime,
} from '../services/authService';
import { useGameStore } from '../store/useGameStore';
import { formatMoney, formatIncome, formatTime } from '../utils/formatters';

export default function AccountScreen() {
  const insets = useSafeAreaInsets();
  const [account, setAccount] = useState<UserAccount | null>(null);
  const [loading, setLoading] = useState(true);
  const [signingIn, setSigningIn] = useState<string | null>(null);
  const [lastSave, setLastSave] = useState(0);

  const getState = useGameStore((s) => s.getState);

  useEffect(() => {
    (async () => {
      const acc = await loadAccount();
      setAccount(acc);
      if (acc) {
        const saveTime = await getLastCloudSaveTime();
        setLastSave(saveTime);
      }
      setLoading(false);
    })();
    return onAccountChange(setAccount);
  }, []);

  const handleGoogleSignIn = async () => {
    hapticMedium();
    setSigningIn('google');
    try {
      const acc = await signInWithGoogle();
      if (acc) {
        Alert.alert('✅ Linked!', `Connected as ${acc.email}`);
      }
    } catch (e: any) {
      Alert.alert('Sign In Failed', e.message || 'Could not connect to Google');
    }
    setSigningIn(null);
  };

  const handleAppleSignIn = async () => {
    hapticMedium();
    setSigningIn('apple');
    try {
      const acc = await signInWithApple();
      if (acc) {
        Alert.alert('✅ Linked!', `Connected as ${acc.email}`);
      }
    } catch (e: any) {
      Alert.alert('Sign In Failed', e.message || 'Apple Sign-In requires a development build');
    }
    setSigningIn(null);
  };

  const handleGuestContinue = async () => {
    hapticLight();
    const acc = await continueAsGuest();
    setAccount(acc);
  };

  const handleSignOut = async () => {
    hapticLight();
    Alert.alert('Sign Out?', 'Your local progress stays on this device. Cloud saves are preserved.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await signOut();
          setAccount(null);
        },
      },
    ]);
  };

  const handleCloudSave = async () => {
    hapticMedium();
    if (!account || account.provider === 'guest') {
      Alert.alert('Link an Account', 'Sign in with Google or Apple to enable cloud saves.');
      return;
    }

    setLoading(true);
    const state = getState();
    const success = await cloudSave(state);
    setLoading(false);

    if (success) {
      const saveTime = await getLastCloudSaveTime();
      setLastSave(saveTime);
      Alert.alert('☁️ Saved!', 'Your progress is safely stored in the cloud.');
    } else {
      Alert.alert('Save Failed', 'Something went wrong. Try again.');
    }
  };

  const handleCloudLoad = async () => {
    hapticMedium();
    if (!account || account.provider === 'guest') {
      Alert.alert('Link an Account', 'Sign in with Google or Apple to load cloud saves.');
      return;
    }

    setLoading(true);
    const cloudState = await cloudLoad();
    setLoading(false);

    if (!cloudState) {
      Alert.alert('No Cloud Save', 'No cloud save found for this account.');
      return;
    }

    Alert.alert(
      'Load Cloud Save?',
      'This will replace your current progress with the cloud save.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Load',
          onPress: () => {
            // Apply cloud state to game store
            const store = useGameStore.getState();
            // Reset to initial then merge
            store.resetGame();
            useGameStore.setState({
              ...cloudState,
            });
            Alert.alert('✅ Loaded!', 'Cloud save has been restored.');
          },
        },
      ]
    );
  };

  const providerIcon = (p: string) => {
    switch (p) {
      case 'google': return 'G';
      case 'apple': return '';
      default: return '👤';
    }
  };

  const providerColor = (p: string) => {
    switch (p) {
      case 'google': return '#4285F4';
      case 'apple': return '#FFFFFF';
      default: return COLORS.textMuted;
    }
  };

  if (loading && !account) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 100 }} />
      </View>
    );
  }

  // ─── Signed In View ──────────────────────────
  if (account) {
    const isCloud = account.provider !== 'guest';
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <Pressable onPress={() => { hapticLight(); router.back(); }} style={styles.backBtn}>
              <Text style={styles.backArrow}>←</Text>
              <Text style={styles.backText}>Back</Text>
            </Pressable>
          </View>

          {/* Avatar */}
          <View style={styles.avatarSection}>
            <View style={[styles.avatar, { backgroundColor: providerColor(account.provider) + '20', borderColor: providerColor(account.provider) }]}>
              <Text style={[styles.avatarText, { color: providerColor(account.provider) }]}>
                {account.provider === 'google' ? 'G' : account.provider === 'apple' ? '🍎' : '👤'}
              </Text>
            </View>
            <Text style={styles.accountName}>{account.name}</Text>
            <Text style={styles.accountEmail}>{account.email || 'No email (Guest)'}</Text>
            <View style={[styles.badge, { backgroundColor: isCloud ? COLORS.success + '20' : COLORS.warning + '20' }]}>
              <Text style={[styles.badgeText, { color: isCloud ? COLORS.success : COLORS.warning }]}>
                {isCloud ? '☁️ Cloud Synced' : '📱 Local Only'}
              </Text>
            </View>
          </View>

          {/* Cloud Save Section */}
          {isCloud && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>☁️ Cloud Save</Text>
              {lastSave > 0 && (
                <Text style={styles.saveInfo}>
                  Last saved: {new Date(lastSave).toLocaleString()}
                </Text>
              )}
              <View style={styles.saveButtons}>
                <Pressable style={styles.cloudBtn} onPress={handleCloudSave}>
                  <Text style={styles.cloudBtnIcon}>⬆️</Text>
                  <Text style={styles.cloudBtnText}>Save to Cloud</Text>
                </Pressable>
                <Pressable style={[styles.cloudBtn, styles.cloudBtnSecondary]} onPress={handleCloudLoad}>
                  <Text style={styles.cloudBtnIcon}>⬇️</Text>
                  <Text style={styles.cloudBtnText}>Load from Cloud</Text>
                </Pressable>
              </View>
            </View>
          )}

          {/* Linked Providers */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Linked Accounts</Text>

            {/* Google */}
            <View style={styles.providerRow}>
              <View style={[styles.providerIconSmall, { backgroundColor: '#4285F4' + '20' }]}>
                <Text style={[styles.providerIconText, { color: '#4285F4' }]}>G</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.providerName}>Google</Text>
                <Text style={styles.providerStatus}>
                  {account.provider === 'google' ? '✅ Linked' : 'Not linked'}
                </Text>
              </View>
              {account.provider !== 'google' && (
                <Pressable
                  style={styles.linkBtn}
                  onPress={handleGoogleSignIn}
                  disabled={signingIn !== null}
                >
                  {signingIn === 'google' ? (
                    <ActivityIndicator size="small" color={COLORS.primary} />
                  ) : (
                    <Text style={styles.linkBtnText}>Link</Text>
                  )}
                </Pressable>
              )}
            </View>

            {/* Apple */}
            <View style={styles.providerRow}>
              <View style={[styles.providerIconSmall, { backgroundColor: '#FFFFFF' + '10' }]}>
                <Text style={[styles.providerIconText, { color: '#FFFFFF' }]}>🍎</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.providerName}>Apple</Text>
                <Text style={styles.providerStatus}>
                  {account.provider === 'apple' ? '✅ Linked' : 'Not linked'}
                </Text>
              </View>
              {account.provider !== 'apple' && (
                <Pressable
                  style={styles.linkBtn}
                  onPress={handleAppleSignIn}
                  disabled={signingIn !== null}
                >
                  {signingIn === 'apple' ? (
                    <ActivityIndicator size="small" color={COLORS.primary} />
                  ) : (
                    <Text style={styles.linkBtnText}>Link</Text>
                  )}
                </Pressable>
              )}
            </View>
          </View>

          {/* Sign Out */}
          <Pressable style={styles.signOutBtn} onPress={handleSignOut}>
            <Text style={styles.signOutText}>Sign Out</Text>
          </Pressable>
        </ScrollView>
      </View>
    );
  }

  // ─── Not Signed In View ──────────────────────
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => { hapticLight(); router.back(); }} style={styles.backBtn}>
            <Text style={styles.backArrow}>←</Text>
            <Text style={styles.backText}>Back</Text>
          </Pressable>
        </View>

        {/* Hero */}
        <View style={styles.heroSection}>
          <Text style={styles.heroIcon}>🔗</Text>
          <Text style={styles.heroTitle}>Link Your Account</Text>
          <Text style={styles.heroSubtitle}>
            Save your empire to the cloud and play across devices.
          </Text>
        </View>

        {/* Google Sign-In */}
        <Pressable
          style={[styles.authButton, styles.googleBtn]}
          onPress={handleGoogleSignIn}
          disabled={signingIn !== null}
        >
          {signingIn === 'google' ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <>
              <View style={[styles.authBtnIcon, { backgroundColor: '#4285F4' }]}>
                <Text style={styles.authBtnIconText}>G</Text>
              </View>
              <Text style={styles.authBtnText}>Continue with Google</Text>
            </>
          )}
        </Pressable>

        {/* Apple Sign-In */}
        <Pressable
          style={[styles.authButton, styles.appleBtn]}
          onPress={handleAppleSignIn}
          disabled={signingIn !== null}
        >
          {signingIn === 'apple' ? (
            <ActivityIndicator size="small" color="#000" />
          ) : (
            <>
              <View style={[styles.authBtnIcon, { backgroundColor: '#000' }]}>
                <Text style={[styles.authBtnIconText, { color: '#fff' }]}>🍎</Text>
              </View>
              <Text style={[styles.authBtnText, { color: '#000' }]}>Continue with Apple</Text>
            </>
          )}
        </Pressable>

        {/* Divider */}
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Guest */}
        <Pressable style={styles.guestBtn} onPress={handleGuestContinue}>
          <Text style={styles.guestBtnText}>Continue as Guest</Text>
          <Text style={styles.guestBtnSub}>Progress stays on this device only</Text>
        </Pressable>

        {/* Benefits */}
        <View style={styles.benefitsSection}>
          <Text style={styles.benefitsTitle}>Why link your account?</Text>
          {[
            { icon: '☁️', text: 'Cloud saves — never lose progress' },
            { icon: '📱', text: 'Play across multiple devices' },
            { icon: '🔄', text: 'Restore progress if you reinstall' },
            { icon: '🏆', text: 'Leaderboards coming soon' },
          ].map((b, i) => (
            <View key={i} style={styles.benefitRow}>
              <Text style={styles.benefitIcon}>{b.icon}</Text>
              <Text style={styles.benefitText}>{b.text}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scroll: { paddingHorizontal: SPACING.lg, paddingBottom: 40 },
  header: { marginBottom: SPACING.md },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: SPACING.sm },
  backArrow: { color: COLORS.primary, fontSize: 18, fontWeight: '700' },
  backText: { color: COLORS.primary, fontSize: 14, fontWeight: '600' },

  // Hero
  heroSection: { alignItems: 'center', paddingVertical: SPACING.xxxl },
  heroIcon: { fontSize: 64, marginBottom: SPACING.md },
  heroTitle: { color: COLORS.text, fontSize: 24, fontWeight: '800', marginBottom: SPACING.sm },
  heroSubtitle: { color: COLORS.textMuted, fontSize: 14, textAlign: 'center', lineHeight: 20 },

  // Auth Buttons
  authButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: RADIUS.lg,
    marginBottom: SPACING.md,
    gap: SPACING.md,
    borderWidth: 1,
  },
  googleBtn: { backgroundColor: '#4285F4', borderColor: '#4285F4' },
  appleBtn: { backgroundColor: '#FFFFFF', borderColor: '#FFFFFF' },
  authBtnIcon: { width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  authBtnIconText: { color: '#fff', fontSize: 14, fontWeight: '800' },
  authBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },

  // Divider
  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: SPACING.lg },
  dividerLine: { flex: 1, height: 1, backgroundColor: COLORS.border },
  dividerText: { color: COLORS.textMuted, fontSize: 12, marginHorizontal: SPACING.md },

  // Guest
  guestBtn: {
    paddingVertical: 16,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  guestBtnText: { color: COLORS.text, fontSize: 16, fontWeight: '700' },
  guestBtnSub: { color: COLORS.textMuted, fontSize: 12, marginTop: 4 },

  // Benefits
  benefitsSection: { marginTop: SPACING.xxxl },
  benefitsTitle: { color: COLORS.text, fontSize: 16, fontWeight: '700', marginBottom: SPACING.md },
  benefitRow: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.md, gap: SPACING.md },
  benefitIcon: { fontSize: 20 },
  benefitText: { color: COLORS.textMuted, fontSize: 14, flex: 1 },

  // Signed In
  avatarSection: { alignItems: 'center', paddingVertical: SPACING.xl },
  avatar: { width: 80, height: 80, borderRadius: 40, borderWidth: 2, justifyContent: 'center', alignItems: 'center', marginBottom: SPACING.md },
  avatarText: { fontSize: 32, fontWeight: '800' },
  accountName: { color: COLORS.text, fontSize: 20, fontWeight: '800' },
  accountEmail: { color: COLORS.textMuted, fontSize: 13, marginTop: 2 },
  badge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: RADIUS.full, marginTop: SPACING.sm },
  badgeText: { fontSize: 12, fontWeight: '700' },

  section: { marginTop: SPACING.xl },
  sectionTitle: { color: COLORS.text, fontSize: 16, fontWeight: '700', marginBottom: SPACING.md },

  // Cloud
  saveInfo: { color: COLORS.textMuted, fontSize: 12, marginBottom: SPACING.md },
  saveButtons: { flexDirection: 'row', gap: SPACING.sm },
  cloudBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 14, borderRadius: RADIUS.lg, backgroundColor: COLORS.primary,
    gap: SPACING.sm,
  },
  cloudBtnSecondary: { backgroundColor: COLORS.surfaceLight, borderWidth: 1, borderColor: COLORS.border },
  cloudBtnIcon: { fontSize: 16 },
  cloudBtnText: { color: COLORS.text, fontSize: 13, fontWeight: '700' },

  // Providers
  providerRow: {
    flexDirection: 'row', alignItems: 'center', padding: SPACING.md,
    borderRadius: RADIUS.lg, backgroundColor: COLORS.surface, marginBottom: SPACING.sm,
  },
  providerIconSmall: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: SPACING.md },
  providerIconText: { fontSize: 16, fontWeight: '800' },
  providerName: { color: COLORS.text, fontSize: 14, fontWeight: '700' },
  providerStatus: { color: COLORS.textMuted, fontSize: 12, marginTop: 1 },
  linkBtn: {
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: RADIUS.full,
    backgroundColor: COLORS.primary, minWidth: 70, alignItems: 'center',
  },
  linkBtnText: { color: '#000', fontSize: 13, fontWeight: '800' },

  // Sign Out
  signOutBtn: {
    marginTop: SPACING.xxxl, paddingVertical: 14, borderRadius: RADIUS.lg,
    alignItems: 'center', borderWidth: 1, borderColor: COLORS.danger + '40',
    backgroundColor: COLORS.danger + '10',
  },
  signOutText: { color: COLORS.danger, fontSize: 14, fontWeight: '700' },
});
