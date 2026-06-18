import React, { useEffect } from 'react';
import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useGameStore } from '../store/useGameStore';
import { COLORS } from '../constants/theme';
import { View, Text, StyleSheet } from 'react-native';

export default function RootLayout() {
  const load = useGameStore((s) => s.load);

  useEffect(() => {
    load();
  }, []);

  return (
    <>
      <StatusBar style="light" />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: COLORS.surface,
            borderTopColor: COLORS.border,
            borderTopWidth: 1,
            height: 70,
            paddingTop: 8,
            paddingBottom: 12,
          },
          tabBarActiveTintColor: COLORS.primary,
          tabBarInactiveTintColor: COLORS.textMuted,
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '600',
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Empire',
            tabBarIcon: ({ color }) => <Text style={[styles.tabIcon, { color }]}>💰</Text>,
          }}
        />
        <Tabs.Screen
          name="shop"
          options={{
            title: 'Shop',
            tabBarIcon: ({ color }) => <Text style={[styles.tabIcon, { color }]}>🏪</Text>,
          }}
        />
        <Tabs.Screen
          name="stats"
          options={{
            title: 'Stats',
            tabBarIcon: ({ color }) => <Text style={[styles.tabIcon, { color }]}>📊</Text>,
          }}
        />
      </Tabs>
    </>
  );
}

const styles = StyleSheet.create({
  tabIcon: {
    fontSize: 20,
  },
});
