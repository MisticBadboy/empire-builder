/**
 * Auth Service — Google & Apple sign-in + cloud saves
 * 
 * Uses expo-auth-session for OAuth flows.
 * Cloud saves stored locally (swap storage backend to Supabase/Firebase when ready).
 * For Expo Go: uses browser-based OAuth. For production builds, use native SDKs.
 */

import * as AuthSession from 'expo-auth-session';
import * as Crypto from 'expo-crypto';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ACCOUNT_KEY = 'empire_builder_account';
const CLOUD_SAVE_KEY = 'empire_builder_cloud_save';

export interface UserAccount {
  id: string;
  provider: 'google' | 'apple' | 'guest';
  name: string;
  email: string;
  avatar?: string;
  linkedAt: number;
  lastCloudSave: number;
}

export interface CloudSaveData {
  gameState: any;
  savedAt: number;
  version: number;
}

const CLOUD_SAVE_VERSION = 1;

// ─── OAuth Config ────────────────────────────────────────
// Replace these with your real client IDs when ready
const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com';
const APPLE_CLIENT_ID = 'com.empirebuilder.app';

const redirectUri = AuthSession.makeRedirectUri({
  scheme: 'empirebuilder',
});

// ─── State ───────────────────────────────────────────────
let _account: UserAccount | null = null;
let _listeners: Array<(account: UserAccount | null) => void> = [];

// ─── Account Management ──────────────────────────────────
export async function loadAccount(): Promise<UserAccount | null> {
  try {
    const raw = await AsyncStorage.getItem(ACCOUNT_KEY);
    if (raw) {
      _account = JSON.parse(raw);
      notifyListeners();
      return _account;
    }
  } catch {}
  return null;
}

export async function saveAccount(account: UserAccount): Promise<void> {
  _account = account;
  await AsyncStorage.setItem(ACCOUNT_KEY, JSON.stringify(account));
  notifyListeners();
}

export async function signOut(): Promise<void> {
  _account = null;
  await AsyncStorage.removeItem(ACCOUNT_KEY);
  notifyListeners();
}

export function getAccount(): UserAccount | null {
  return _account;
}

export function isSignedIn(): boolean {
  return _account !== null;
}

export function onAccountChange(listener: (account: UserAccount | null) => void): () => void {
  _listeners.push(listener);
  return () => {
    _listeners = _listeners.filter((l) => l !== listener);
  };
}

function notifyListeners() {
  _listeners.forEach((l) => l(_account));
}

function generateId(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 24; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// ─── Google Sign-In ──────────────────────────────────────
export async function signInWithGoogle(): Promise<UserAccount | null> {
  try {
    const request = new AuthSession.AuthRequest({
      clientId: GOOGLE_CLIENT_ID,
      scopes: ['openid', 'profile', 'email'],
      redirectUri,
      responseType: AuthSession.ResponseType.Code,
      extraParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    });

    const result = await request.promptAsync({
      authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
    });

    if (result.type === 'success' && result.params.code) {
      // In production: exchange code for tokens on your backend
      // For now: create the account (simulating successful auth)
      const account: UserAccount = {
        id: generateId(),
        provider: 'google',
        name: 'Google User',
        email: 'user@gmail.com',
        linkedAt: Date.now(),
        lastCloudSave: 0,
      };
      await saveAccount(account);
      return account;
    }
  } catch (error) {
    console.warn('Google sign-in error:', error);
  }
  return null;
}

// ─── Apple Sign-In ───────────────────────────────────────
export async function signInWithApple(): Promise<UserAccount | null> {
  try {
    const nonce = generateId();
    const hashedNonce = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      nonce
    );

    const request = new AuthSession.AuthRequest({
      clientId: APPLE_CLIENT_ID,
      scopes: ['name', 'email'],
      redirectUri,
      responseType: AuthSession.ResponseType.Code,
      extraParams: {
        nonce: hashedNonce,
        response_mode: 'form_post',
      },
    });

    const result = await request.promptAsync({
      authorizationEndpoint: 'https://appleid.apple.com/auth/authorize',
    });

    if (result.type === 'success' && result.params.code) {
      // In production: exchange code for tokens on your backend
      const account: UserAccount = {
        id: generateId(),
        provider: 'apple',
        name: 'Apple User',
        email: 'user@privaterelay.appleid.com',
        linkedAt: Date.now(),
        lastCloudSave: 0,
      };
      await saveAccount(account);
      return account;
    }
  } catch (error) {
    console.warn('Apple sign-in error:', error);
  }
  return null;
}

// ─── Guest Mode ──────────────────────────────────────────
export async function continueAsGuest(): Promise<UserAccount> {
  const account: UserAccount = {
    id: generateId(),
    provider: 'guest',
    name: 'Guest',
    email: '',
    linkedAt: Date.now(),
    lastCloudSave: 0,
  };
  await saveAccount(account);
  return account;
}

// ─── Cloud Save / Load ───────────────────────────────────
// Currently saves locally with a user-specific key.
// Swap the storage backend to Supabase/Firebase when ready.

export async function cloudSave(gameState: any): Promise<boolean> {
  if (!_account) return false;

  try {
    const cloudData: CloudSaveData = {
      gameState,
      savedAt: Date.now(),
      version: CLOUD_SAVE_VERSION,
    };

    const cloudKey = `${CLOUD_SAVE_KEY}_${_account.id}`;
    await AsyncStorage.setItem(cloudKey, JSON.stringify(cloudData));

    _account.lastCloudSave = Date.now();
    await saveAccount(_account);

    return true;
  } catch (error) {
    console.warn('Cloud save failed:', error);
    return false;
  }
}

export async function cloudLoad(): Promise<any | null> {
  if (!_account) return null;

  try {
    const cloudKey = `${CLOUD_SAVE_KEY}_${_account.id}`;
    const raw = await AsyncStorage.getItem(cloudKey);
    if (raw) {
      const cloudData: CloudSaveData = JSON.parse(raw);
      return cloudData.gameState;
    }
  } catch (error) {
    console.warn('Cloud load failed:', error);
  }
  return null;
}

export async function cloudDeleteSave(): Promise<void> {
  if (!_account) return;
  const cloudKey = `${CLOUD_SAVE_KEY}_${_account.id}`;
  await AsyncStorage.removeItem(cloudKey);
}

export async function getLastCloudSaveTime(): Promise<number> {
  if (!_account) return 0;
  try {
    const cloudKey = `${CLOUD_SAVE_KEY}_${_account.id}`;
    const raw = await AsyncStorage.getItem(cloudKey);
    if (raw) {
      const cloudData: CloudSaveData = JSON.parse(raw);
      return cloudData.savedAt;
    }
  } catch {}
  return 0;
}
